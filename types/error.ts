export type AppError = {
    name: string;
    message: string;
    cause?: Error;
    statusCode?: number;
};
