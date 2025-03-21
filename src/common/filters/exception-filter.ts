import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Define a type for the error response
type ErrorResponse =
  | {
      message?: string | string[];
      statusCode?: number;
      error?: string;
    }
  | string;

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as ErrorResponse;

    let errorMessage = 'Erro ao realizar esta operação';

    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
    } else if (errorResponse.message) {
      errorMessage = Array.isArray(errorResponse.message)
        ? errorResponse.message[0]
        : errorResponse.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: errorMessage,
      path: request.url,
    });
  }
}
