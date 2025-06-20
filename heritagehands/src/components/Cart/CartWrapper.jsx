import React from 'react';
import { useSelector } from 'react-redux';
import Cart from './Cart';
import GuestCart from './GuestCart';

const CartWrapper = () => {
  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);

  // Check if user is logged in (either as user or vendor)
  const isLoggedIn = (userData && Object.keys(userData).length > 0) || 
                    (vendorData && Object.keys(vendorData).length > 0);

  // If logged in, show normal cart, otherwise show guest cart
  return isLoggedIn ? <Cart /> : <GuestCart />;
};

export default CartWrapper; 