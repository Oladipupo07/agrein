import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

const JWT_SECRET = config.jwtSecret;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'farmer' | 'buyer' | 'delivery_partner' | 'admin';
      };
    }
  }
}

export type AuthRequest = Request;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token' });
    }
    req.user = decoded as NonNullable<Request['user']>;
    next();
  });
};

export const requireRole = (roles: Array<'farmer' | 'buyer' | 'delivery_partner' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of the following roles: [${roles.join(', ')}]` });
    }

    next();
  };
};
