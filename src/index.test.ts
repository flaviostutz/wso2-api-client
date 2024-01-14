/* eslint-disable camelcase */
import nock from 'nock';

import { WSO2APIMSDK, WSO2APIMConfig } from './index';

const testConfig: WSO2APIMConfig = {
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

    const cli = await WSO2APIMSDK.create({
      baseUrl: 'https://test.com',
      username: 'aaa',
      password: 'bbb',
    });
    expect(cli.devportal).toBeDefined();
  });
});
