import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Recetas from './pages/Recetas'
import DetalleReceta from './pages/DetalleReceta'
import Favoritas from './pages/Favoritas'
import NoEncontrada from './pages/NoEncontrada'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/recetas' element={<Recetas />} />
      <Route path='/recetas/:id' element={<DetalleReceta />} />
      <Route path='/favoritas' element={<Favoritas />} />
      <Route path='*' element={<NoEncontrada />} />
    </Routes>
  )

}

export default App