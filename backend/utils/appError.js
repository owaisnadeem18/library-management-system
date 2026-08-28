export class AppError extends Error {

    constructor(message , statusCode) {
    
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Operational errors (known) vs Programming errors (unknown bugs)
        Error.captureStackTrace(this, this.constructor);
    
    }

}