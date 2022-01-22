import { Application } from "https://deno.land/x/oak/mod.ts";

const port = 3000;

const app = new Application();

// Error handler middleware
app.use(async (_context, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
  }
});

// Send static content
app.use(async (context) => {
  console.log(`${context.request.method} ${context.request.url.pathname}`);
  await context.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
});

await app.listen({ port });
