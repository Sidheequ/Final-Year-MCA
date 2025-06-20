import React from 'react'
import Product from '../Product/ProductList'
import About from '../About/About'
import HeroSection from '../Carousel/HeroSection'

const Main = () => {
  return (
    <div className="section-container">
      <div className="content-wrapper">
        <HeroSection />
        <Product />
        <About />
      </div>
    </div>
  )
}

export default Main