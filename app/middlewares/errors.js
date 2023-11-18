import ErrorHandler from "../utils/errorHandle.js";

export const handleError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    console.log(err);
    if(err.name === "TokenExpiredError") {
        let message= " && JWT Is Expired";
        err = new ErrorHandler(message, 400);
    };

    if(err.statusCode === 110000) {
        let message = `Duplicate ${Object.keys(err.keyValue)} entered;`;
        err = new ErrorHandler(message, 400);
    };

    if(err.name === "JsonWebTokenError") {
        let message= " && JWT Is Invalid";
        err = new ErrorHandler(message, 400);
    };

    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        status : err.statusCode
    });
}