class ErrorHandler extends Error {
    constructor(message, statusCode){
        // kế thừa message từ Error 
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;