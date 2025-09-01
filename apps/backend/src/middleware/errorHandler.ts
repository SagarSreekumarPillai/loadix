import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error
  console.error(`❌ Error ${statusCode}: ${message}`);
  console.error('Stack:', error.stack);

  // Don't leak error details in production
  const errorResponse = {
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  };

  // Add validation errors if available
  if (error.name === 'ValidationError') {
    errorResponse.error.message = 'Validation Error';
    // You can add more validation details here
  }

  res.status(statusCode).json(errorResponse);
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
