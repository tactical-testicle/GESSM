import {Response, NextFunction } from "express";
// import { AuthRequest } from "./auth.middleware";

// export const authorizeRoles = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ error: "No tienes permiso para acceder a esta ruta" });
//     }
//     next();
//   };
// };
