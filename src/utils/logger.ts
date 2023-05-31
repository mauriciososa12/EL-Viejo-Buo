import { createLogger, transports, format } from "winston";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const prodLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(format.simple()),
    }),
    new transports.File({
      filename: "./errors.log",
      level: "warning",
      format: format.simple(),
    }),
  ],
});

const devLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(format.simple()),
    }),
    new transports.File({
      filename: "./errors.log",
      level: "warning",
      format: format.simple(),
    }),
  ],
});

export const addLogger = (req: Request, res: Response, next: NextFunction) => {
  const enviroment = process.env.ENVIROMENT_VAR;

  if (enviroment === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }

  const date = new Date().toLocaleDateString();
  req.logger.info(`METHOD: ${req.method}, ENDPOINT: ${req.url}, DATE: ${date}`);

  next();
};
