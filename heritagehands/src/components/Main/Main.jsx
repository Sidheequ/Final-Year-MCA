import React from 'react'
import Product from '../Product/ProductList'
import About from '../About/About'
import Carousel from '../Carousel/Carousel'
import Contact from '../Contact Us/Contact'


const Main = () => {
  return (
    <div>
      <Carousel />
      <Product />
        <About />
        <Contact />
       
       
    
    </div>
  )
}

export default Main