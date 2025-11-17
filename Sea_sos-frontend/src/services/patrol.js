import axios from '../axios';
import { errorAlert, success } from "./alerts";
import globalConfig from './config.js';

export const submitPatrol = async (data, operationMode) => {
  console.log("submit button called  ")
  let json = {
    supervisor: data.supervisor,
    status: data.status,
    location: data.location,
    teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : data.teamMembers.split(',').map(member => member.trim()),
    assignedMissions: data.assignedMissions
    
  }
  try {
    console.log('Received data:', data);
    const response = operationMode === 'create'
      ? await axios.post(`/api/patrols/create`, json)
      : await axios.put(`/api/patrols/update/${data._id}`, json);
    success(response.data.message);
  } catch (error) {
    errorAlert(error.response.data.message);
  }
};

export const fetchPatrols = async () => {
  try {
    const response = await axios.get(`/api/patrols/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    errorAlert('Error fetching patrols');
    throw error;
  }
};

export const deletePatrol = async (id) => {
  try {
    const response = await axios.delete(`${globalConfig.BACKEND_URL}/api/patrols/delete/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    success(response.data.message);
  } catch (error) {
    errorAlert('Error deleting patrol');
    throw error;
  }
};
