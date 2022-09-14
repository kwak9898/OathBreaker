import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorMessage =
      typeof exception.getResponse() === "object"
        ? (exception.getResponse() as any)?.message
        : exception.message;

    const code =
      typeof exception.getResponse() === "object"
        ? (exception.getResponse() as any)?.code
        : exception.getStatus();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage || exception.message,
      code,
    });
  }
}
