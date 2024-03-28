import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaPaypal } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import BillingAddressForm from "./BillingAddressForm";
import Swal from "sweetalert2";


const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setcardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [billingAddressData,setbillingAddressData] =useState({})

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  //taking address data from billingaddressform
  const handleBillingAddressData = (data)=>{
      setbillingAddressData(data);
  }
  // console.log("Billing Address Data from Checkoutform",billingAddressData);

  useEffect(() => {
    if (typeof price !== "number" || price < 1) {
      console.error(
        "Invalid price value. Must be a number greater than or equal to 1."
      );
      return;
    }
    axiosSecure.post("/create-payment-intent", { totalPrice }).then((res) => {
      // console.log(res.data.clientSecret);
      setClientSecret(res.data.clientSecret);
    });
  }, [price, axiosSecure]);

  // handleSubmit btn click
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    // Check if billing address is provided
    if (Object.keys(billingAddressData).length === 0) {
      Swal.fire({
        title: "Billing Address Required",
        text: "Please enter your billing address before proceeding to checkout.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // console.log('card: ', card)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setcardError(error.message);
    } else {
      // setcardError('Success!');
      // console.log('[PaymentMethod]', paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "anonymous",
            email: user?.email || "unknown",
          },
        },
      });

    if (confirmError) {
      console.log(confirmError);
    }

    // console.log("paymentIntent", paymentIntent);

    if (paymentIntent.status === "succeeded") {
      const transitionId = paymentIntent.id;
      setcardError(`Your transitionId is: ${transitionId}`);

      // save payment info to server
      const paymentInfo = {
        email: user.email,
        transitionId: paymentIntent.id,
        price: totalPrice,
        quantity: cart.reduce(
          (totalQuantity, item) => totalQuantity + item.quantity,
          0
        ),
        status: "order pending",
        itemsQuantity: cart.map((item) => item.quantity),
        itemsName: cart.map((item) => item.name),
        cartItems: cart.map((item) => item._id),
        menuItems: cart.map((item) => item.menuItemId),
        billingAddress:billingAddressData,
      };

      // send payment info
      axiosSecure.post("/payments", paymentInfo).then((res) => {
        // console.log(res.data);
        if (res.data) {
          Swal.fire({
            icon: "success",
            title: `Payment done and info sent successfully!`,
            showConfirmButton: false,
            timer: 2000,
          })
          // alert("Payment info sent successfully!");
          navigate("/order");
        }
      });
    }
  };
  // console.log("Cart value is :", cart);
  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-2">
      <div className="md:w-1/2 space-y-3">
        <h4 className="text-lg text-black font-semibold">Order Summary</h4>
        <div className="text-black">
          {cart.map((item, idx) => (
            <div className="flex gap-3" key={item._id}>
              <p>{idx + 1}.</p>
              <div>
                <p>Item Name: {item.name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}<br/>
          <p>
            Total Price: ₹
            {cart.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </p>
          <p>Total Items: {cart.length}</p>
        </div>
        {/* Billing Address */}<br/>
        <h4 className="text-lg text-black font-semibold">Billing Address</h4>
        <BillingAddressForm sendBillingData={handleBillingAddressData}/>
      </div>
      
      <div
        className={`md:w-1/3 w-full border space-y-5  card shrink-0 max-w-sm shadow-2xl px-4 py-8 bg-white`}
      >
        <h4 className="text-lg font-semibold text-black">Process your Payment!</h4>
        <h5 className="font-medium text-black">Credit/Debit Card</h5>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe || !clientSecret}
            className="btn btn-primary btn-sm mt-5 w-full"
          >
            Pay
          </button>
        </form>
        {cardError ? (
          <p className="text-red text-xs italic">{cardError}</p>
        ) : (
          ""
        )}

        <div className="mt-5 text-center">
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
