import { NextFunction, Request, Response } from "express";
declare global {
  declare type ExpressRequest = Request & { userId?: number };
  declare type ExpressResponse = Response;
  declare type ExpressNextFunction = NextFunction;
  declare type AsyncRequestHandler = (_: ExpressRequest, _: ExpressResponse, _: ExpressNextFunction) => Promise<void>;
  type Session = {
    userId: string;
  };
}
