import axios from 'axios';

const BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = (rollNumber: string, name: string) => {
  return axios.post(`${BASE_URL}/create-user`, {
    rollNumber,
    name,
  });
};

export const getForm = (rollNumber: string) => {
  return axios.get(`${BASE_URL}/get-form?rollNumber=${rollNumber}`);
};