import express from "express";
import { router } from "./route";
import { correlationId } from "./pkg/correlation/correlationid";
import cookieParser from 'cookie-parser';
export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(correlationId);
app.use(cookieParser());
  app.use("/api", router);
  return app;
}
