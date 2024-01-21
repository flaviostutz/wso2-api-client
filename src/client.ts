import createClient from 'openapi-fetch';
import { Agent, setGlobalDispatcher } from 'undici';

import { checkWso2ServerVersion, getBearerToken, registerClient } from './utils';
import { Wso2ApimConfig } from './types';
import { paths as pathsPublisherV1 } from './v1/generated/types/publisher';
import { paths as pathsDevportalV1 } from './v1/generated/types/devportal';
import { Wso2ApimClientV1 } from './v1/types';

export const Wso2ApimSdk = {
  /**
   * Creates a new WSO2 APIM Client instance
   * @param {WSo2ApimConfig} config Configuration for connecting to WSO2 APIM
   * @returns WSO2 APIM Client
   */
  createV1: async (config: Wso2ApimConfig): Promise<Wso2ApimClientV1> => {
    if (!config.baseUrl) throw new Error(`'baseUrl' is required`);
    if (!config.username) throw new Error(`'username' is required`);
    if (!config.password) throw new Error(`'password' is required`);

    // default is true
    if (typeof config.tlsRejectUnauthorized === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      config.tlsRejectUnauthorized = true;
    }

    // configure native fetch module (used by API client calls)
    const agent = new Agent({
      connect: {
        rejectUnauthorized: config.tlsRejectUnauthorized,
      },
    });
    setGlobalDispatcher(agent);

    const clientCredentials = await registerClient(config);
    const accessToken = await getBearerToken(config, clientCredentials);

    await checkWso2ServerVersion(config, 'v1');

    return {
      publisher: createClient<pathsPublisherV1>({
        baseUrl: `${config.baseUrl}/api/am/publisher/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      devportal: createClient<pathsDevportalV1>({
        baseUrl: `${config.baseUrl}/api/am/store/v1/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    };
  },
};
