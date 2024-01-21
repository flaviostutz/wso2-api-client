/* eslint-disable camelcase */
import nock from 'nock';

import { Wso2ApimConfig } from './types';

import { Wso2ApimSdk } from './index';

const testConfig: Wso2ApimConfig = {
  baseUrl: 'https://test.com',
  username: 'user1',
  password: 'passwd1',
};

describe('index', () => {
  it('functions are exported', async () => {
    // register client mock
    nock(`${testConfig.baseUrl}`).post('/client-registration/v0.17/register').reply(200, {
      clientId: 'id1',
      clientSecret: 'secret1',
    });

    // get token mock
    nock(`${testConfig.baseUrl}`).post('/oauth2/token').reply(200, {
      access_token: '1111-token-2222',
    });

    // mock server check
    const scopev = nock(`${testConfig.baseUrl}`)
      .get('/services/Version')
      .reply(
        200,
        '<ns:getVersionResponse xmlns:ns="http://version.services.core.carbon.wso2.org"><return>WSO2 API Manager-3.2.0</return></ns:getVersionResponse>',
      );

    const cli = await Wso2ApimSdk.createV1({
      baseUrl: 'https://test.com',
      username: 'aaa',
      password: 'bbb',
    });
    expect(cli.devportal).toBeDefined();
    scopev.done();
  });
});
