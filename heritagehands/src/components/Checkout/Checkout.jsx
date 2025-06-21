import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderServices';
import { toast } from 'react-toastify';
import './Checkout.css';

function Checkout() {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const userData = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });

    // Add card details state
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    useEffect(() => {
        if (userData?.shippingAddress) {
            setShippingAddress(userData.shippingAddress);
        }
    }, [userData]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            // Format card number with spaces every 4 digits
            const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
            setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        } else if (name === 'expiryDate') {
            // Format expiry date as MM/YY
            const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setCardDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const shippingFee = 40.00;
    const subtotal = getTotalPrice();
    const totalAmount = subtotal + shippingFee;

    // Validate card details
    const validateCardDetails = () => {
        const { cardNumber, expiryDate, cvc } = cardDetails;
        
        if (!cardNumber || cardNumber.trim() === '') {
            toast.error('Please enter your card number');
            return false;
        }
        
        if (!expiryDate || expiryDate.trim() === '') {
            toast.error('Please enter card expiry date');
            return false;
        }
        
        if (!cvc || cvc.trim() === '') {
            toast.error('Please enter CVC');
            return false;
        }
        
        // Basic validation for card number (should be 16 digits)
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            toast.error('Please enter a valid 16-digit card number');
            return false;
        }
        
        // Basic validation for expiry date (MM/YY format)
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            toast.error('Please enter expiry date in MM/YY format');
            return false;
        }
        
        // Basic validation for CVC (3-4 digits)
        if (cvc.length < 3 || cvc.length > 4) {
            toast.error('Please enter a valid CVC (3-4 digits)');
            return false;
        }
        
        return true;
    };

    const handlePayNow = async () => {
        // Validate card details before proceeding
        if (!validateCardDetails()) {
            return;
        }

        setIsProcessing(true);
        const orderData = {
            products: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            shippingAddress,
            billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
            paymentDetails: {
                cardNumber: cardDetails.cardNumber.replace(/\s/g, '').slice(-4), // Only send last 4 digits
                expiryDate: cardDetails.expiryDate
            },
            paymentMethod: 'card' // Add payment method for vendor notifications
        };

        try {
            await createOrder(orderData);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/userdashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to place order.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="checkout-container">
                <h2>Your cart is empty.</h2>
                <button onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-form-column">
                {/* Contact Information */}
                <div className="checkout-section">
                    <h2>Contact Information</h2>
                    <p>Email: {userData?.email || 'Loading...'}</p>
                </div>

                {/* Shipping Address */}
                <div className="checkout-section">
                    <h2>Shipping Address</h2>
                    <input type="text" name="address" placeholder="Address" value={shippingAddress.address} onChange={handleShippingChange} />
                    <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleShippingChange} />
                    <input type="text" name="state" placeholder="State / Province" value={shippingAddress.state} onChange={handleShippingChange} />
                    <input type="text" name="postalCode" placeholder="Postal Code" value={shippingAddress.postalCode} onChange={handleShippingChange} />
                </div>
                
                {/* Billing Address */}
                <div className="checkout-section">
                    <h2>Billing Address</h2>
                    <label>
                        <input type="checkbox" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(!billingSameAsShipping)} />
                        Same as shipping address
                    </label>
                    {!billingSameAsShipping && (
                        <div className="billing-form">
                            <input type="text" name="address" placeholder="Address" value={billingAddress.address} onChange={handleBillingChange} />
                            <input type="text" name="city" placeholder="City" value={billingAddress.city} onChange={handleBillingChange} />
                            <input type="text" name="state" placeholder="State / Province" value={billingAddress.state} onChange={handleBillingChange} />
                            <input type="text" name="postalCode" placeholder="Postal Code" value={billingAddress.postalCode} onChange={handleBillingChange} />
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                <div className="checkout-section">
                    <h2>Payment Details</h2>
                    <p>This is a mock payment form. Do not enter real card details.</p>
                    <input 
                        type="text" 
                        name="cardNumber"
                        placeholder="Card Number (16 digits)" 
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        maxLength="19"
                    />
                    <input 
                        type="text" 
                        name="expiryDate"
                        placeholder="MM/YY" 
                        value={cardDetails.expiryDate}
                        onChange={handleCardChange}
                        maxLength="5"
                    />
                    <input 
                        type="text" 
                        name="cvc"
                        placeholder="CVC" 
                        value={cardDetails.cvc}
                        onChange={handleCardChange}
                        maxLength="4"
                    />
                </div>
            </div>

            <div className="checkout-summary-column">
                <div className="checkout-section">
                    <h2>Order Summary</h2>
                    {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                            <img src={item.image} alt={item.title} />
                            <div className="item-details">
                                <span>{item.title}</span>
                                <span>Qty: {item.quantity}</span>
                            </div>
                            <span>₹{item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    <hr />
                    <div className="summary-line">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                        <span>Shipping</span>
                        <span>₹{shippingFee.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary-line total">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <button className="pay-now-btn" onClick={handlePayNow} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : `Pay Now (₹${totalAmount.toFixed(2)})`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout; 