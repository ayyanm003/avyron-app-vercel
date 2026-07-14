import React from 'react'
import Hero from '../component/Hero'
import Category from '../component/Category'
import Product from '../component/Product'
import About from '../component/About'
import Contact from '../component/Contact'
import Footer from '../component/Footer'
import Tester from '../component/Tester'

const Home = () => {
  return (
    <>
      <Hero/>
      <Category/>
      {/* <Tester/> */}
      <Product />
      <About/>
      <Contact/>
      {/* <Footer/> */}
    </>
  )
}

export default Home
