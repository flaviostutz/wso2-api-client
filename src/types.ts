/* eslint-disable @typescript-eslint/ban-ts-comment */
import createClient from 'openapi-fetch';

import { paths as pathsPublisher } from './generated/types/publisher';
import { paths as pathsDevportal } from './generated/types/devportal';

const pubType = createClient<pathsPublisher>();
const devType = createClient<pathsDevportal>();

export type WSO2APIMClient = {
  publisher: typeof pubType;
  devportal: typeof devType;
};

export type WSO2APIMConfig = {
  /**
   * WSO2 API base Url. E.g.: https://mywso2.com
   */
  baseUrl: string;
  /**
   * WSO2 API username
   */
  username: string;
  /**
   * WSO2 API password
   */
  password: string;
  /**
   * WSO2 client name registered before API calls
   * Defaults to 'wso2apim-sdk-client'
   */
  clientName?: string;
  /**
   * WSO2 owner identification
   * Defaults to [username]
   */
  owner?: string;
  /**
   * Accepts unverified hosts during TLS handshake
   * Defaults to false
   */
  tlsRejectUnauthorized?: boolean;
};

export type ClientCredentials = {
  clientId: string;
  clientSecret: string;
};
