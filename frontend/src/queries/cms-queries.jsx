import axios from 'axios';

import { HOST_CMS, HEADERS } from './constants';

export const findAllImages = ({ owner }) => {
  return axios.get(`${HOST_CMS}?owner=${owner}`, { HEADERS }).then(({ data }) => data);
};

export const uploadImage = ({ owner, image }) => {
  return axios
    .post(`${HOST_CMS}/upload?owner=${owner}`, { image }, { HEADERS })
    .then(({ data }) => data);
};

export const restoreImage = ({ owner, versionId }) => {
  return axios
    .post(`${HOST_CMS}/restore?owner=${owner}&versionId=${versionId}`, { HEADERS })
    .then(({ data }) => data);
};
