// app/api/auth.ts

import axios from 'axios';

// Replace with your backend server's URL based on your environment

// For iOS Simulator or Web:
//const API_BASE_URL = 'http://localhost:3000';

// For Android Emulator:
const API_BASE_URL = 'http://10.0.2.2:3000';

// For Physical Devices:
// const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000'; // Replace with your actual IP

// Sign Up
export const signUp = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Sign In
export const signIn = async (email: string, password: string) => {
  try {
    console.log('SignIn Request Data:', { email, password });
    const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
    console.log('SignIn Response Data:', response.data);
    return response.data;
  } catch (error: any) {
    // Existing error handling
    throw error;
  }
};



// Assign User Type
export const assignUserType = async (token: string, userType: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user-type`,
      { userType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Fetch User Details
export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returns the full user object
  } catch (error: any) {
    throw error;
  }
};

// Update Personal Information
export const updatePersonalInformation = async (token: string, personalInfo: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/personal-information`, personalInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Add other API functions for additional information as needed
