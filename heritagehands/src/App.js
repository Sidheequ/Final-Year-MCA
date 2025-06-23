import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import StatsSection from './components/StatusSection/StatusSection';
import About from './components/About/About';
import Contact from './components/Contact Us/Contact';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import Main from './components/Main/Main';
import CartWrapper from './components/Cart/CartWrapper';
import Product from './components/Product/ProductList';
import ProductDetail from './components/Product/ProductDetail';
import Footer from './components/Footer/Footer';
import VendorLog from './components/vendor/VendorLog';
import AdminLogin from './components/Login/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import VendorReg from './components/vendor/VendorReg';
import VendorDashboard from './components/VendorDashboard/VendorDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import Checkout from './components/Checkout/Checkout';
import OrdersPage from './components/Order/OrdersPage';

import { CartProvider } from './context/CartContext';

function App() {
  return (

    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <AppRoutes />
        <Footer />
      </CartProvider>
    </BrowserRouter>

  );
}

function AppRoutes() {
  const location = useLocation();
  const adminVendorRoutes = [
    '/admin', '/adminDashboard', '/admindashboard', '/vendordashboard', '/adminlogin', '/vendorlog', '/vendorreg'
  ];
  const isAdminOrVendor = adminVendorRoutes.includes(location.pathname);

  if (isAdminOrVendor) {
    // Admin/Vendor dashboards: CartProvider is present globally
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/vendordashboard" element={<VendorDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/vendorlog" element={<VendorLog />} />
        <Route path="/vendorreg" element={<VendorReg />} />
      </Routes>
    );
  }

  // User-facing pages: CartProvider is present globally
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<CartWrapper />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/stats" element={<StatsSection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;