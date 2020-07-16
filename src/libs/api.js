import axios from 'axios';

axios.interceptors.request.use(
  config => {
    if (window.env.apiPrefix) {
      config.baseURL = window.env.apiPrefix;
    }
    config.timeout = 200000;

    const token = localStorage.getItem('login_token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// const url = env.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
// axios.socketUrl = process.env.NODE_ENV === 'production' ? `${url}/events` : '';

export default axios;
