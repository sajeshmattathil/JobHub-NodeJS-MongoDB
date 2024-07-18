// src/types/express.d.ts
import  'express-session';

declare module 'express-session' {
  export interface SessionData {
    user?: string;
  }
}
