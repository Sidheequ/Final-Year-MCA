import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import StatsSection from './components/StatusSection/StatusSection';
import About from './components/About/About';
import Contact from './components/Contact Us/Contact';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import Main from './components/Main/Main';
import Cart from './components/Cart/Cart';
import Product from './components/Product/ProductList';
import Footer from './components/Footer/Footer';
import VendorLog from './components/vendor/VendorLog';
import AdminLogin from './components/Login/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import VendorReg from './components/vendor/VendorReg';
import VendorDashboard from './components/VendorDashboard/VendorDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import ProductDetail from './components/Product/ProductDetail';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/stats" element={<StatsSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/admin" element={<AdminDashboard />} /> 
          <Route path="/vendorreg" element={<VendorReg />} />
          <Route path="/vendorlog" element={<VendorLog />} />
          <Route path="/vendordashboard" element={<VendorDashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;