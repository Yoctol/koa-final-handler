import compose from 'koa-compose';
import validate, { object, string } from 'koa-context-validator';

import finalHandler from '../';

const middleware = finalHandler();

const createContext = ({ status }) => ({
  request: {
    method: 'GET',
    url: '/private',
    header: {
      host: 'www.yoctol.com',
      connection: 'keep-alive',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, sdch, br',
      'accept-language': 'en,zh;q=0.8,zh-TW;q=0.6',
      cookie: 'gsScrollPos=0',
    },
    body: {},
  },
  response: {
    status,
  },
  app: {
    emit: jest.fn(),
  },
  throw: jest.fn(),
});

const nodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  process.env.NODE_ENV = nodeEnv;
});

it('should be defined', () => {
  expect(finalHandler).toBeDefined();
});

it('should return middleware after executed', () => {
  const middleware = finalHandler();
  expect(middleware).toBeInstanceOf(Function);
});

describe('finalHandler', () => {
  it('not call error if no error', async () => {
    const ctx = createContext({ status: 200 });
    const next = jest.fn(() => Promise.resolve());

    await middleware(ctx, next);

    expect(next).toBeCalled();
    expect(ctx.app.emit).not.toBeCalled();
  });

  it('set status 404 and throw if no status set', async () => {
    const ctx = createContext({});
    const next = jest.fn(() => Promise.resolve());

    await middleware(ctx, next);

    expect(next).toBeCalled();
    expect(ctx.throw).toBeCalledWith(404);
  });

  it('call error if error happens', async () => {
    const error = new Error('my error');
    const ctx = createContext({ status: 500 });
    const next = jest.fn(() => Promise.reject(error));
    console.error = jest.fn();

    await middleware(ctx, next);

    expect(next).toBeCalled();
    expect(ctx.app.emit).toBeCalledWith('error', error, ctx);
  });

  it('append error on response.body when NODE_ENV is `development`', async () => {
    process.env.NODE_ENV = 'development';

    const finalHandler = require('../');
    const middleware = finalHandler();

    const error = new Error('my error');
    const ctx = createContext({ status: 500 });
    const next = jest.fn(() => Promise.reject(error));
    console.error = jest.fn();

    await middleware(ctx, next);

    expect(ctx.response.body).toEqual({ error });
  });

  it('will not get error on response.body when NODE_ENV is `production`', async () => {
    process.env.NODE_ENV = 'production';

    const finalHandler = require('../');
    const middleware = finalHandler();

    const error = new Error('my error');
    const ctx = createContext({ status: 500 });
    const next = jest.fn(() => Promise.reject(error));
    console.error = jest.fn();

    await middleware(ctx, next);

    expect(ctx.response.body).toBeUndefined();
  });
});

it('should support Joi errors', async () => {
  const composed = compose([
    middleware,
    validate({
      body: object().keys({
        username: string().required(),
      }),
    }),
  ]);

  const ctx = createContext({});
  const next = jest.fn(() => Promise.resolve());

  await composed(ctx, next);

  expect(ctx.response.status).toEqual(400);
  expect(ctx.response.body).toHaveProperty(
    'error.message',
    '"username" is required'
  );
});
