/* eslint-disable @typescript-eslint/ban-ts-comment */
import createClient from 'openapi-fetch';

import { paths as pathsPublisher } from './generated/types/publisher';
import { paths as pathsDevportal } from './generated/types/devportal';

const pubType = createClient<pathsPublisher>();
const devType = createClient<pathsDevportal>();

export type Wso2ApimClientV1 = {
  publisher: typeof pubType;
  devportal: typeof devType;
};
