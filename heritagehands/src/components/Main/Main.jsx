import React from 'react'
import Product from '../Product/ProductList'
import About from '../About/About'
import Carousel from '../Carousel/Carousel'

const Main = () => {
  return (
    <div className="section-container">
      <div className="content-wrapper">
        <Carousel />
        <Product />
        <About />
      </div>
    </div>
  )
}

export default Main