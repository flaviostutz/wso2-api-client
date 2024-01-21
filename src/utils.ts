import https from 'https';

import qs from 'qs';
import axios from 'axios';

import { ClientCredentials, Wso2ApimConfig } from './types';

export const registerClient = async (config: Wso2ApimConfig): Promise<ClientCredentials> => {
  const data = {
    clientName: config.clientName ?? 'wso2apim-sdk-client',
    owner: config.owner ?? config.username,
    grantType: 'password refresh_token',
    saasApp: true,
  };

  const authTokenBase64 = Buffer.from(`${config.username}:${config.password}`).toString('base64');

  const axiosConfig = {
    headers: {
      Authorization: `Basic ${authTokenBase64}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: config.tlsRejectUnauthorized,
    }),
  };

  const res = axios.post<ClientCredentials>(
    `${config.baseUrl}/client-registration/v0.17/register`,
    data,
    axiosConfig,
  );

  return (await res).data;
};

export const getBearerToken = async (
  config: Wso2ApimConfig,
  clientCredentials: ClientCredentials,
): Promise<string> => {
  const data = qs.stringify({
    // eslint-disable-next-line camelcase
    grant_type: 'password',
    username: config.username,
    password: config.password,
    scope: 'apim:api_create apim:api_view apim:api_publish apim:api_delete',
  });

  const authTokenBase64 = Buffer.from(
    `${clientCredentials.clientId}:${clientCredentials.clientSecret}`,
  ).toString('base64');

  let tlsRejectUnauthorized = true;
  if (typeof config.tlsRejectUnauthorized !== 'undefined') {
    // eslint-disable-next-line prefer-destructuring
    tlsRejectUnauthorized = config.tlsRejectUnauthorized;
  }

  const axiosConfig = {
    headers: {
      Authorization: `Basic ${authTokenBase64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: tlsRejectUnauthorized,
    }),
  };

  const res = axios.post<{ access_token: string }>(
    `${config.baseUrl}/oauth2/token`,
    data,
    axiosConfig,
  );

  return (await res).data.access_token;
};
