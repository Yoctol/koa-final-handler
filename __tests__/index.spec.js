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
  },
  response: {
    status,
  },
  app: {
    emit: jest.fn(),
  },
  throw: jest.fn(),
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
    expect(ctx.response.body).toEqual({ error });
    expect(ctx.app.emit).toBeCalledWith('error', error, ctx);
  });
});
