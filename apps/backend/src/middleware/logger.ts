import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 10);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 500 ? "\x1b[31m"
      : res.statusCode >= 400 ? "\x1b[33m"
      : res.statusCode >= 300 ? "\x1b[36m"
      : "\x1b[32m";

    console.log(
      `${color}[${requestId}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms\x1b[0m`
    );
  });

  next();
}
