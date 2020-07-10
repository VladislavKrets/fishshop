import axios from 'axios';
import settings from './settings'
export default axios.create({
  baseURL: settings().BASE_URL,
});