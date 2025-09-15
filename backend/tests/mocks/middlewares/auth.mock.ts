import { Request, Response, NextFunction } from 'express';

export const authMock = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.header('x-test-user');
  try {
    const parsed = header ? JSON.parse(header) : { id: 'u-client', role: 'client' };
    (req as any).user = parsed;
  } catch (_e) {
    (req as any).user = { id: 'u-client', role: 'client' };
  }
  next();
};

