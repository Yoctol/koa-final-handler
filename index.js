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
    } else {
      ctx.response.status = 500;

      if (NODE_ENV !== 'production') {
        ctx.response.body = { error };
      }
    }
    ctx.app.emit('error', error, ctx);
  }
};

module.exports = finalHandler;
