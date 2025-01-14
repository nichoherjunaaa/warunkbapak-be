const notFound = (req,res,next) => {
    const error = new Error(`Not Found Path - ${req.originalUrl}`);
    res.status(404)
    next(error);
}

const errorHandler = (error, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error.message


    if(error.name === "Validation Error"){
        message = Object.values(error.errors)
        .map((item) => item.message).join(',');
        statusCode = 400
    }

    res.status(statusCode).json({
        message,
        stack : error.stack
    })
}

export {notFound, errorHandler}