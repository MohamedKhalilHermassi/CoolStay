import { useState } from 'react'
import './App.css'
import NavBar from './components/FrontOffice/NavBar'
import Footer from './components/FrontOffice/Footer'
import Listing from './components/FrontOffice/Listing'
import { Carousel } from 'react-responsive-carousel'
import Gallery from './components/FrontOffice/Gallery'

function App() {

  return (
    <>



      <NavBar></NavBar>
      <Listing></Listing>
      <Footer></Footer>
    </>
  )
}

export default App
