// This service is strictly for making the http request, sending the data back, and setting data in local storage

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const API_URL = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/users' : 'https://api.hosebox.net/api/users';

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);

    // if post request receives userdata response, save in local storage
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

// login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    // if post request receives userdata response, save in local storage
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

// Logout user (simply) by removing them + token from local storage
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    'register': register,
    'login'   : login,
    'logout'  : logout,
}

export default authService;