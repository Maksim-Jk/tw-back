import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const checkValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const customError = new CustomError(
      400,
      'Validation',
      'Task validation error',
      null,
      null,
      errors.array().map((err) => ({
        value: err.msg,
        msg: err.msg,
      })),
    );
    next(customError);
    return;
  }
  next();
};
