import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { testRouter } from "./routes/test/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  test: testRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
