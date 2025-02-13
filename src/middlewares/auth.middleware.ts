import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface AuthRequest extends Request {
    user?: jwt.JwtPayload | string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {


    try {
        // console.log(req.user);
        
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    
        if (!token) {
            res.status(401).json({ message: "Unauthorized: Invalid token format" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token or token expired" });
    }
};
