import axios from '../axios';
import { errorAlert, success } from "./alerts";
import globalConfig from './config';


export const signIn = async (email, password) => {
 
  try {
    const response = await axios.post(`${globalConfig.BACKEND_URL}/api/auth/login`, { email, password });
   
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
      sessionStorage.setItem('token', token); // Store token in sessionStorage

     
    } else {
      throw new Error('Token not found in response');
    }
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    errorAlert('Error signing in'); // Show error alert
    throw error;
  }
};

export const submitUser = async (data, operationMode) => {
 
  let json = {
    fullname: data.fullname,
    email: data.email,
    password: data.password,
    gender: data.gender,
    phone: data.phone,
    address: data.address
  }
  try {
    const response = operationMode === 'create'
  ? await axios.post('/api/users/create', json)
  : await axios.put(`/api/users/update/${data._id}`, json, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
      }, {
          fullname: data.fullname,
          gender: data.gender,
          phone: data.phone,
          address: data.address
        });
    success(response.data.message);
  } catch (error) {
    errorAlert(error.response.data.message);
  }
};

export const resetpwd = (e) => {
  axios.post(globalConfig.BACKEND_URL + '/api/resetpwd/send', {
    email: e.target.email.value
  })
    .then(response => success("We've sent an email, please open your inbox."))
    .catch(err => errorAlert(err.response.data.message))
};

export const changepwd = async (e, token) => {
  const response = await axios.post(globalConfig.BACKEND_URL + '/api/resetpwd', {
    newPassword: e.target.password.value,
    token: token
  });
  return response.data;
};

export const verifyUser = async () => {
  try {
    const response = await axios.post(
      `${globalConfig.BACKEND_URL}/api/auth/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          
        }
        
      },
      
    );
    
    return response.data;
  } catch (error) {
    
    console.error('Error verifying user:', error);
    throw error;
  }
};
