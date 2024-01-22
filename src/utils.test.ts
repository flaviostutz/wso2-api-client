/* eslint-disable camelcase */
import nock from 'nock';

import { checkWso2ServerVersion, getBearerToken, registerClient } from './utils';
import { Wso2ApimConfig } from './types';

const testConfig: Wso2ApimConfig = {
  baseUrl: 'https://test.com',
  username: 'user1',
  password: 'passwd1',
  tlsRejectUnauthorized: false,
};

describe('utils', () => {
  it('registerClient should invoke WSO2 endpoints', async () => {
    const scope = nock(`${testConfig.baseUrl}`)
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
    const scope = nock(`${testConfig.baseUrl}`).post('/oauth2/token').reply(200, {
      access_token: '1111-token-2222',
    });

    const token = await getBearerToken(testConfig, { clientId: 'c1', clientSecret: 's1' });
    expect(token).toBe('1111-token-2222');

    scope.done();
  });

  it('check WSO2 server version should fail if strange results appears up', async () => {
    const scope = nock(`${testConfig.baseUrl}`)
      .get('/services/Version')
      .reply(200, 'STRANGE RETURN');
    const f = async (): Promise<void> => {
      await checkWso2ServerVersion(testConfig, 'v1');
    };
    await expect(f).rejects.toThrow('Client for API v1 requires WSO2 server 3.x');
    scope.done();
  });

  it('check WSO2 server version should fail if endpoint doesnt answer properly with 200', async () => {
    const scope = nock(`${testConfig.baseUrl}`).get('/services/Version').reply(404);
    const f = async (): Promise<void> => {
      await checkWso2ServerVersion(testConfig, 'v1');
    };
    await expect(f).rejects.toThrow(`Couldn't check server version`);
    scope.done();
  });

  // eslint-disable-next-line jest/expect-expect
  it('check WSO2 server version should pass if OK v1', async () => {
    const scope = nock(`${testConfig.baseUrl}`)
      .get('/services/Version')
      .reply(
        200,
        '<ns:getVersionResponse xmlns:ns="http://version.services.core.carbon.wso2.org"><return>WSO2 API Manager-3.2.0</return></ns:getVersionResponse>',
      );
    const f = async (): Promise<void> => {
      await checkWso2ServerVersion(testConfig, 'v1');
    };
    await f();
    scope.done();
  });

  it('check WSO2 server version should pass if OK v2', async () => {
    const scope = nock(`${testConfig.baseUrl}`)
      .get('/services/Version')
      .reply(
        200,
        '<ns:getVersionResponse xmlns:ns="http://version.services.core.carbon.wso2.org"><return>WSO2 API Manager-4.0.0</return></ns:getVersionResponse>',
      );
    const f = async (): Promise<void> => {
      await checkWso2ServerVersion(testConfig, 'v2');
    };
    await f();
    scope.done();
  });

  it('check WSO2 server version should fail if not supported', async () => {
    const scope = nock(`${testConfig.baseUrl}`)
      .get('/services/Version')
      .reply(
        200,
        '<ns:getVersionResponse xmlns:ns="http://version.services.core.carbon.wso2.org"><return>WSO2 API Manager-4.2.0</return></ns:getVersionResponse>',
      );
    const f = async (): Promise<void> => {
      await checkWso2ServerVersion(testConfig, 'v1');
    };
    await expect(f).rejects.toThrow('Client for API v1 requires WSO2 server 3.x');
    scope.done();
  });
});
