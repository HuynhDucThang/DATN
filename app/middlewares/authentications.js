import ErrorHandler from "../utils/errorHandle.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
   
    const token = req.headers.token.split('=')[1] || req.headers.token;
 
    if(!token) {
        return next(new ErrorHandler('Your must authentication !!', 400));
    };

    const user = jwt.verify(token, process.env.JWT_SECRET);
  
    if(!user) {
        return next(new ErrorHandler('Token Wrong !!', 400));
    };

    req.user = user;

    next();
};

export const isUser = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user) {
            next();
        }else{
            return next(new ErrorHandler(500, "user is not authentication"));
        }
    });
};