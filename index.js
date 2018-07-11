const HTTP_STATUS = require('http-status');

const { NODE_ENV } = process.env;

const finalHandler = () => async (ctx, next) => {
  try {
    await next();
    // Handle 404 upstream.
    const status = ctx.response.status || 404;
    if (status === 404) ctx.throw(404);
  } catch (error) {
    if (error.status) {
      ctx.response.status = error.status;
    } else if (error.name === 'ValidationError') {
      ctx.response.status = 400;
      ctx.response.body = {
        error: {
          message: error.details
            ? error.details.map(d => d.message).join('\n')
            : null,
        },
      };
    } else {
      ctx.response.status = 500;

      if (NODE_ENV === 'development') {
        ctx.response.body = { error };
      }
    }

    if (!ctx.response.body) {
      let msg;
      if (error.message && NODE_ENV !== 'production') msg = error.message;
      else msg = HTTP_STATUS[ctx.response.status];

      ctx.response.body = {
        error: { message: msg },
      };
    }

    ctx.app.emit('error', error, ctx);
  }
};

module.exports = finalHandler;
