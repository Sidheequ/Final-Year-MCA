import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserAddress } from '../../services/userServices';
import { saveUser } from '../../redux/features/userSlice';

const AddressSettings = () => {
    const userData = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    
    const [address, setAddress] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });

    useEffect(() => {
        if (userData?.shippingAddress) {
            setAddress(userData.shippingAddress);
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUserAddress(address);
            dispatch(saveUser(response.data.user));
            toast.success('Address updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update address.');
        }
    };

    return (
        <div className="account-settings-container">
            <h3>Shipping Address</h3>
            <p>Update your default shipping address.</p>
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={address.address || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={address.city || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>State / Province</label>
                    <input type="text" name="state" value={address.state || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" value={address.postalCode || ''} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-submit">Save Address</button>
            </form>
        </div>
    );
};

export default AddressSettings; 