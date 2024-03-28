import React from 'react'
import Banner from '../../components/Banner'
import Catagories from './Catagories'
import SpecialDishes from './SpecialDishes'

const Home = () => {
  return (
    <div>
       <Banner/>
       <Catagories/>
       <SpecialDishes/>
    </div>
  )
}

export default Home