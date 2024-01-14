/* eslint-disable camelcase */
import nock from 'nock';

import { WSO2APIMConfig } from './types';

import { WSO2APIMSDK } from '.';

const testConfig: WSO2APIMConfig = {
  host: 'https://test.com',
  username: 'user1',
  password: 'passwd1',
};

describe('client', () => {
  it('client should initiate by preparing tokens', async () => {
    // register client mock
    const nClient = nock(`https://${testConfig.host}:${testConfig.port}`)
      .post('/client-registration/v0.17/register')
      .reply(200, {
        clientId: 'id1',
        clientSecret: 'secret1',
      });

    // get token mock
    const nToken = nock(`https://${testConfig.host}:${testConfig.port}`)
      .post('/oauth2/token')
      .reply(200, {
        access_token: '1111-token-2222',
      });

    const client = await WSO2APIMSDK.create(testConfig);
    client.devportal.GET('/apis', { params: { header: {}, query: { query: 'name' } } });

    nClient.done();
    nToken.done();
  });
});
