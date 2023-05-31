import { Request, Response } from "express";

export const getLoggerTest = (req: Request, res: Response) => {
  try {
    req.logger.debug("Debug Test");
    req.logger.info("Info Test");
    req.logger.http("Http Test");
    req.logger.warning("Warning Test");
    req.logger.error("Error Test");
    req.logger.fatal("Fatal Error Test");
  } catch (error) {
    req.logger.error(error);
  }
};