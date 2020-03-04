import axios, { AxiosResponse } from 'axios';
import { IWhoop, IUser } from 'models/whoop';

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  config => {
    // const token = window.localStorage.getItem('jwt');
    // HARDCODED FOR TESTING
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIzMWM4OTE2MS02N2M5LTRlNzUtYmFiZi0xZmY4YmIyOTc5OWIiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNDBjMGQ2OC0zMzhlLTQ0ZWYtYWIxNy04MTJlZTQyZDEyYzcvIiwiaWF0IjoxNTgzMzE5NDE3LCJuYmYiOjE1ODMzMTk0MTcsImV4cCI6MTU4MzMyMzMxNywiYWlvIjoiNDJOZ1lORG1VZEc5VjhPVnRDSW5kT1Y4enJvNXNUdGUvTWhoRmFxNHYvRC91b0RyL3hRQiIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJSb2duZXMiLCJnaXZlbl9uYW1lIjoiRXJsZW5kIiwiaGFzZ3JvdXBzIjoidHJ1ZSIsImlwYWRkciI6IjE5My4yMTIuOTUuMjQ5IiwibmFtZSI6IlJvZ25lcyBFcmxlbmQiLCJub25jZSI6IjJhODMwOTRkLThhOGEtNGJkYS05NzZjLTZmMmNjMzU0YzI4YSIsIm9pZCI6ImY5ZWEwMjlhLTFhOTAtNGQyMy05YTYzLWI5ZTY4YjZhOTQ4NiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzQzMDI0MDkxLTE0MTcwMDEzMzMtNjgyMDAzMzMwLTU1MjY2Iiwic3ViIjoiM2ZhOFNaRHdzeWl6bHFSTkVERzB2VXFYUWlSN3BWSXg1MHFaU0pIdkhkVSIsInRpZCI6ImE0MGMwZDY4LTMzOGUtNDRlZi1hYjE3LTgxMmVlNDJkMTJjNyIsInVuaXF1ZV9uYW1lIjoidTQwNDM2QGVuZXJneWNvcnAuY29tIiwidXBuIjoidTQwNDM2QGVuZXJneWNvcnAuY29tIiwidXRpIjoiOHZFdUI0Z2l4MGE3SU9NVHJTOFZBQSIsInZlciI6IjEuMCJ9.MYQ9Y0bfBMYn55fSFmZ5CZVWiUIsbvkxgwA32FWIOIt8nnteHadoTIiWTHVYSrZNr4obghiUPCIbPRV9r9AoZHJFrjfXym9Ko4O12wbTY9GZpx-iEh54-Bb5HeoUQSfxxLiaDTO8-RY8jsy7AIJjHJEU9DTJzf9_kdYdJiOcbcgpZj5W33hLgXLn8so5LHpK2j-8iuz_CGYpw6GvMtMcuKJMdl2daKABWZAXoInl6szMd39xlVW1l6QW-q_U-h2AvZhTCRlzMX98UBnzQl3mUABv8HbR893DBspA8qvr0IhAoYT6pn3E5AEUmKKCs7e-1e-itg0GdFIm9vIt8VRtfA";
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  console.log(error);
  if (error.message === 'Network Error' && !error.response) {
    console.log('Network error - make sure API is running!');
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    console.error('/notfound');
  }
  if (status === 401 && headers['www-authenticate'] === 'Bearer error="invalid_token", error_description="The token is expired"') {
    // window.localStorage.removeItem('jwt');
    console.info('Your session has expired, please login again')
  }
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    console.log('/notfound');
  }
  if (status === 500) {
    console.error('Server error - check the terminal for more info!');
  }
  throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) =>
    axios
      .get(url)
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(responseBody)
};

const Whoops = {
  list: (): Promise<IWhoop[]> =>
    axios.get('/getall').then(responseBody),
  search: (name: string): Promise<IUser[]> =>
    axios.get('search?q=' + name).then(responseBody),
  create: (whoop: IWhoop) => requests.post('/', whoop),
};

export default {
  Whoops
};
