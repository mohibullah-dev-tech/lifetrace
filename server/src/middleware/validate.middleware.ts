import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (
  schema: ZodType,
  source: "body" | "query" = "body"
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const data = schema.parse(req[source]);

      if (source === "body") {
        req.body = data;
      }

      _res.locals.validated = data;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }

      next(error);
    }
  };
};