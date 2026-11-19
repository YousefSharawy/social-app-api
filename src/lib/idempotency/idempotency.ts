import { NextFunction, Request, Response } from "express";
import { cacheProvider } from "../cache/init.js";
export function idempotency(ttl = 3600) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const idempotency = req.headers["idempotency-key"];
    const key = `${req.method}:${req.originalUrl}:${idempotency}`;
    const cached = await cacheProvider.get(key);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheProvider.set(key, JSON.stringify(body), ttl);
        res.setHeader("X-Cache", "MISS");
      }
      return originalJson(body);
    };
    next();
  };
}
