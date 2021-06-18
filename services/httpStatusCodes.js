module.exports.ResponseHandler = function (res, code, data, trace) {
    switch(code) {
        case 204:
            res.status(204).json({
                status: 'success',
                message: "Record successfully deleted",
            });
            break;
        case 404:
            res.status(404).json({
                status: 'error',
                error: "Resource not found",
            });
            break;
        case 403:
            res.status(404).json({
                status: 'error',
                error: trace,
            });
            break;
        case 401:
            res.status(401).json({
                status: 'error',
                error: "you don't have access for this record",
            });
        case 500:
            res.status(500).json({
                status: 'error',
                error: trace,
            });
            break;
        default:
            res.status(200).json({
                status: 'success',
                data: data,
            });
    }

};