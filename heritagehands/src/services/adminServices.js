import axiosInstance from '../axios/axiosinstance';

// Test function to check vendors without auth
export const testGetVendors = async () => {
    try {
        const response = await axiosInstance.get('/admin/test-vendors');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Vendors (Admin)
export const getAllVendors = async () => {
    try {
        const response = await axiosInstance.get('/admin/vendors');
        return response;
    } catch (error) {
        throw error;
    }
};

// Approve Vendor (Admin)
export const approveVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.put(`/admin/vendors/${vendorId}/approve`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Reject Vendor (Admin)
export const rejectVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.put(`/admin/vendors/${vendorId}/reject`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete Vendor (Admin)
export const deleteVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.delete(`/admin/vendors/${vendorId}`);
        return response;
    } catch (error) {
        throw error;
    }
}; 