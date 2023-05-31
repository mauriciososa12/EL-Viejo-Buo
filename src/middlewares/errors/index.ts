import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`El error es: ${error}`);

  const errorMessage = error.name || "Unhandled error";

  res.send({
    status: "Error",
    error: errorMessage,
  });
};
