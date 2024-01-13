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
    const clientCredentials = await registerClient(config);
    const accessToken = await getBearerToken(config, clientCredentials);

    return {
      publisher: createClient<pathsPublisher>({
        baseUrl: `https://${config.wso2Host}:${config.wso2Port}/api/am/publisher/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      devportal: createClient<pathsDevportal>({
        baseUrl: `https://${config.wso2Host}:${config.wso2Port}/api/am/publisher/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    };
  },
};
