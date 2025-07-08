// Base Error Class
export class ErrorHandler extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Operational Errors
export class NotFoundError extends ErrorHandler {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class ValidationError extends ErrorHandler {
    constructor(message: string = 'Invalid input data') {
        super(message, 400);
    }
}

export class DatabaseError extends ErrorHandler {
    constructor(message: string = 'Database operation failed') {
        super(message, 500);
    }
}



export class InternalServerError extends ErrorHandler {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
    }
}
