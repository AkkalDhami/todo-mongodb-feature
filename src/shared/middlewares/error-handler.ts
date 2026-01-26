import { Request, Response, NextFunction } from "express";
import env from "../configs/env";

import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || null;
  }

  logger.error(
    err,
    `Error: ${message} | Status: ${statusCode} | Path: ${req.method} ${req.originalUrl}`
  );

  const response = {
    success: false,
    message,
    statusCode,
    ...(errors !== null && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};
