import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Beach from './components/FrontOffice/Beach'
import Mountain from './components/FrontOffice/Mountain'
import Layout from './components/FrontOffice/Layout'

function App() {

  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="listing/beach" element={<Beach />} />
          <Route path="listing/mountain" element={<Mountain />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
