import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

function BillingAddressForm({sendBillingData}) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submittedData, setSubmittedData] = useState({});

  const onSubmit = (data) => {
    console.log("Data from billingaddressform",data);
    setSubmittedData(data);
    sendBillingData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
            First Name
          </label>
          <input
            {...register('firstName', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="first-name"
            type="text"
            placeholder="Abhishek"
          />
          {errors.firstName && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
            Last Name
          </label>
          <input
            {...register('lastName', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            id="last-name"
            type="text"
            placeholder="Alhawat"
          />
          {errors.lastName && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            {...register('phoneNumber', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="phoneNumber"
            type="phoneNumber"
          />
          {errors.phoneNumber && <p className="text-red text-xs itali">Please fill out this field.</p>}
        </div>
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="country">
            Country
          </label>
          <div className="relative">
            <select
              {...register('country', { required: true })}
              className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="country"
            >
              <option>India</option>
              <option>Russia</option>
              <option>Mexico</option>
            </select>
            {errors.country && <p className="text-red text-xs italic">Please select a country.</p>}
          </div>
        </div>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address-line1">
            Address Line 1
          </label>
          <textarea
            {...register('addressLine1', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
            id="address-line1"
            rows="4"
            placeholder="123 Main St"
          />
          {errors.addressLine1 && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            {...register('city', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            id="city"
            type="text"
            placeholder="Anytown"
          />
          {errors.city && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
            State / Province
          </label>
          <input
            {...register('state', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            id="state"
            type="text"
            placeholder="State"
          />
          {errors.state && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="pincode">
            Pin Code
          </label>
          <input
            {...register('pincode', { required: true })}
            className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            id="pincode"
            type="text"
            placeholder="90210"
          />
          {errors.pincode && <p className="text-red text-xs italic">Please fill out this field.</p>}
        </div>
        <div className="w-full px-3 mt-6">
          <button
            type="submit"
            className="mx-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default BillingAddressForm;

