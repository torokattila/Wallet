import { useContext } from 'react';
import ApiClient from '../api/ApiClient';
import ApiContext from '../contexts/ApiContext';

const useApi = (): ApiClient => useContext<ApiClient>(ApiContext);

export default useApi;
