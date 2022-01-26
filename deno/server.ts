import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { FFT, ComplexNumber } from "./fft.ts";

const port = 3000;

const app = new Application();
const router = new Router();

// Error handler middleware
app.use(async (_context, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
  }
});

router.post("/fft", async (context) => {
  if (!context.request.hasBody) {
    context.response.status = 400;
    context.response.body = {
      msg: "fft: no body",
    };
    return;
  }
  const q = await context.request.body().value;
  const cs: ComplexNumber[] = [];
  for (let i = 0; i < q.xs.length; ++i) {
    cs[i] = new ComplexNumber(q.xs[i], q.ys[i]);
  }
  const fft = new FFT(cs.length);
  const rds = fft.undo(cs);
  // cfgs sz, rot, fre
  const cfgs = [];
  for (let i = 0; i < rds.length; i++) {
    cfgs.push({
      size: rds[i].length,
      rotation: rds[i].rot,
      frequency: i + 1,
    })
  }
  console.log(cfgs);
  context.response.body = cfgs;
});

app.use(router.routes());
app.use(router.allowedMethods());

// Send static content
app.use(async (context) => {
  console.log(`${context.request.method} ${context.request.url.pathname}`);
  await context.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
});

await app.listen({ port });
