import createClient from 'openapi-fetch';

import { paths as pathsPublisher } from './generated/types/publisher';
import { paths as pathsDevportal } from './generated/types/devportal';
import { WSO2APIMClient, WSO2APIMConfig } from './types';
import { getBearerToken, registerClient } from './utils';

export const WSO2APIMSDK = {
  /**
   * Creates a new WSO2 APIM Client instance
   * @param {WSO2APIMConfig} config Configuration for connecting to WSO2 APIM
   * @returns WSO2 APIM Client
   */
  create: async (config: WSO2APIMConfig): Promise<WSO2APIMClient> => {
    if (!config.baseUrl) throw new Error(`'baseUrl' is required`);
    if (!config.username) throw new Error(`'username' is required`);
    if (!config.password) throw new Error(`'password' is required`);

    const clientCredentials = await registerClient(config);
    const accessToken = await getBearerToken(config, clientCredentials);

    return {
      publisher: createClient<pathsPublisher>({
        baseUrl: `${config.baseUrl}/api/am/publisher/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      devportal: createClient<pathsDevportal>({
        baseUrl: `${config.baseUrl}/api/am/store/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    };
  },
};
