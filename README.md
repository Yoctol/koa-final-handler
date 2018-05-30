# koa-final-handler

[![npm](https://img.shields.io/npm/v/@yoctol/koa-final-handler.svg)](https://www.npmjs.com/package/@yoctol/koa-final-handler)

> Final handler middleware for [koa](https://github.com/koajs/koa)

## Installation

Install using npm:

```sh
npm install @yoctol/koa-final-handler
```

## Usage

```js
const Koa = require('koa');
const finalHandler = require('@yoctol/koa-final-handler');

const app = new Koa();

app.use(finalHandler());
/* using other middleware after this line */
app.use(auth());
app.use(route());

app.listen(8080, () => {
  console.log('server is running on http://localhost:8080');
});
```

### Response Body

The middleware will append error object on response body when `NODE_ENV` is `development`.

```js
const { error } = response.body;
```

### Error Reporting

```js
const handleErrorReporting = (error, ctx) => {
  /* your error reporting handler */
};

app.on('error', handleErrorReporting);
```
