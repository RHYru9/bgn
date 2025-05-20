import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // sesuaikan dengan URL Laravel kamu
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
