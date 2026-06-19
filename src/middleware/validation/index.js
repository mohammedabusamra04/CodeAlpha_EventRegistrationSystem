const { fail } = require('./helpers');
const {
    registerSchema,
    loginSchema,
    eventSchema,
    reviewSchema,
    applySchema
} = require('./schemas');

function createBodyValidator(schema) {
    return (req, res, next) => {
        const { errors, sanitized } = applySchema(req.body || {}, schema);

        if (errors.length > 0) {
            return fail(res, errors[0], errors);
        }

        req.body = { ...req.body, ...sanitized };
        next();
    };
}

function validateParamId(paramName = 'id') {
    return (req, res, next) => {
        const raw = req.params[paramName];
        const parsed = parseInt(raw, 10);

        if (!raw || isNaN(parsed) || parsed <= 0 || String(parsed) !== String(raw).trim()) {
            return fail(res, `Invalid ${paramName}`);
        }

        req.params[paramName] = String(parsed);
        next();
    };
}

const validateRegister = createBodyValidator(registerSchema);
const validateLogin = createBodyValidator(loginSchema);
const validateEvent = createBodyValidator(eventSchema);
const validateReview = createBodyValidator(reviewSchema);

module.exports = {
    createBodyValidator,
    validateParamId,
    validateRegister,
    validateLogin,
    validateEvent,
    validateReview
};
