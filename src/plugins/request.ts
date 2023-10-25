/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/',
  headers: { Authorization: `Bearer ${process.env.VUE_APP_AUTH}` },
});

export default httpClient;
