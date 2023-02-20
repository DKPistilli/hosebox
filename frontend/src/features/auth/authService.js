// This service is strictly for making the http request, sending the data back, and setting data in local storage

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);

    // if post request receives userdata response, save in local storage
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

const authService = {
    'register': register,
}

export default authService;