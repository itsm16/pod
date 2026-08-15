
import { z } from "../../schema";
import { testService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Test"];
const getPath = generatePath("/test");

export const testRouter = router({
  test: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/test"), tags: TAGS } })
    // .input()
    .output(z.object({
      message: z.string(),
      status: z.number()
    }))
    .query(async () => {
      const result = await testService.test();
      return result;
    }),
});
