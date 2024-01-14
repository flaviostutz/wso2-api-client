/* eslint-disable camelcase */
import nock from 'nock';

import { WSO2APIMConfig } from './types';
import { getBearerToken, registerClient } from './utils';

const testConfig: WSO2APIMConfig = {
  host: 'https://test.com',
  username: 'user1',
  password: 'passwd1',
};

describe('utils', () => {
  it('registerClient should invoke WSO2 endpoints', async () => {
    const scope = nock(`https://${testConfig.host}:${testConfig.port}`)
      .post('/client-registration/v0.17/register')
      .reply(200, {
        clientId: 'id1',
        clientSecret: 'secret1',
      });

    const credentials = await registerClient(testConfig);
    expect(credentials).toStrictEqual({
      clientId: 'id1',
      clientSecret: 'secret1',
    });

    scope.done();
  });
  it('getBearerToken should invoke WSO2 endpoints', async () => {
    const scope = nock(`https://${testConfig.host}:${testConfig.port}`)
      .post('/oauth2/token')
      .reply(200, {
        access_token: '1111-token-2222',
      });

    const token = await getBearerToken(testConfig, { clientId: 'c1', clientSecret: 's1' });
    expect(token).toBe('1111-token-2222');

    scope.done();
  });
});
