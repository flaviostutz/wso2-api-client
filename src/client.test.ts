/* eslint-disable camelcase */
import nock from 'nock';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { WSO2APIMConfig } from './types';

import { WSO2APIMSDK } from '.';

enableFetchMocks();

const testConfig: WSO2APIMConfig = {
  baseUrl: 'https://test.com',
  username: 'user1',
  password: 'passwd1',
};

describe('client', () => {
  it('client should initiate by preparing tokens', async () => {
    // register client mock
    const nClient = nock(`${testConfig.baseUrl}`)
      .post('/client-registration/v0.17/register')
      .reply(200, {
        clientId: 'id1',
        clientSecret: 'secret1',
      });

    // get token mock
    const nToken = nock(`${testConfig.baseUrl}`).post('/oauth2/token').reply(200, {
      access_token: '1111-token-2222',
    });

    // api mock
    // nock doesn't work with native fetch (which is used by fetch api)
    fetchMock.mockResponseOnce(JSON.stringify({ secret_data: 'abcde', status: 200 }));

    const client = await WSO2APIMSDK.create(testConfig);
    const res = await client.devportal.GET('/apis', {
      params: { header: {}, query: { query: 'name' } },
    });
    expect(res).toBeDefined();
    expect(fetchMock.mock.calls[0][0]).toBe('https://test.com/api/am/store/v1/apis?query=name');

    nClient.done();
    nToken.done();
  });

  it('should require inputs', async () => {
    // register client mock
    nock(`${testConfig.baseUrl}`).post('/client-registration/v0.17/register').reply(200, {
      clientId: 'id1',
      clientSecret: 'secret1',
    });

    // get token mock
    nock(`${testConfig.baseUrl}`).post('/oauth2/token').reply(200, {
      access_token: '1111-token-2222',
    });

    const f = async (): Promise<void> => {
      await WSO2APIMSDK.create({
        baseUrl: testConfig.baseUrl,
        username: '',
        password: '',
      });
    };
    await expect(f).rejects.toThrow('username');

    const f2 = async (): Promise<void> => {
      await WSO2APIMSDK.create({
        baseUrl: testConfig.baseUrl,
        username: 'aaaaa',
        password: '',
      });
    };
    await expect(f2).rejects.toThrow('password');

    const f3 = async (): Promise<void> => {
      await WSO2APIMSDK.create({
        baseUrl: '',
        username: 'aaaaa',
        password: 'aaaaa',
      });
    };
    await expect(f3).rejects.toThrow('baseUrl');
  });
});
