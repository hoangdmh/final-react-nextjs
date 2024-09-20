import Header from './components/header/header'
import './App.css'

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header/>
      <Outlet />
      <footer>footer</footer>
    </>
  )
}

export default App
