import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const testRouter = createTRPCRouter({
    hello: publicProcedure
    .output(z.object({message: z.string(), status: z.number()}))
    .query(()=>{
        return {
            message: "Hello from test router!",
            status: 200
        }
    })
});
