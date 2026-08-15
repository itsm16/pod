import http from "node:http";
import { logger } from "@repo/logger";
import { createSocketServer } from "@repo/socket/server";
import { app as expressApplication } from "./server";

import { env } from "./env";

async function init() {
  try {
    const httpServer = http.createServer(expressApplication);
    createSocketServer(httpServer);
    const PORT: number = env.PORT ? +env.PORT : 8000;
    httpServer.listen(PORT, () => {
      logger.info(`http server is running on PORT ${PORT}`);
    });
  } catch (err) {
    logger.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();