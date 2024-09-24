import Header from './components/header/header'
import './App.css'

import { Outlet } from "react-router-dom";
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // login
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@gmail.com',
        password: '123456',
      }),
    });
    const d = await response.json();
    if (d.data) {
      localStorage.setItem("access_token", d.data.access_token);
    }
  }

  return (
    <>
      <Header/>
      <Outlet />
      <footer>footer</footer>
    </>
  )
}

export default App
