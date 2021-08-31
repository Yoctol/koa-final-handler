import type Koa from 'koa';

declare function finalHandler<
  StateT = Koa.DefaultState,
  ContextT = Koa.DefaultContext
>(): Koa.Middleware<StateT, ContextT>;

export default finalHandler;
