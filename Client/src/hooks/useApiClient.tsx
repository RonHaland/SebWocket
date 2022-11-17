import axios from "axios";

interface apiClient {
  post: (path: string, data: any) => any;
  get: (path: string) => any;
}
const baseUrl = process.env.REACT_APP_API_URL;

const useApiClient = () => {
  const apiClient = { post, get } as apiClient;
  return apiClient;
};

const post = (path: string, data: any) => {
  return axios.post(baseUrl + path, data);
};

const get = (path: string) => {
  return axios.get(baseUrl + path);
};

export default useApiClient;
