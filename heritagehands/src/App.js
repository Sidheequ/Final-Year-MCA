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
import NotFound from './components/NotFound';
import OrderSummary from './components/Order/OrderSummary';
import OrderDetail from './components/Order/OrderDetail';

import { CartProvider } from './context/CartContext';
import { useSelector } from 'react-redux';

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
  const admin = useSelector((state) => state.admin.admin);
  const vendor = useSelector((state) => state.vendor.vendor);

  const isAdminOrVendorLoggedIn = (admin && Object.keys(admin).length > 0) || (vendor && Object.keys(vendor).length > 0);

  const adminVendorRoutes = [
    '/admin', '/adminDashboard', '/admindashboard', '/vendordashboard'
  ];
  const isAdminOrVendorPath = adminVendorRoutes.includes(location.pathname);

  // Only show admin/vendor routes if logged in as admin or vendor
  if (isAdminOrVendorLoggedIn && isAdminOrVendorPath) {
    return (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/vendordashboard" element={<VendorDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Otherwise, show user-facing routes
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
      <Route path="/orders/:orderId" element={<OrderDetail />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/vendorlog" element={<VendorLog />} />
      <Route path="/vendorreg" element={<VendorReg />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;