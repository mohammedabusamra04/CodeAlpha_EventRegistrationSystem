const {
    LIMITS,
    EMAIL_REGEX,
    PHONE_REGEX,
    sanitizeString,
    isNonEmptyString,
    parsePositiveInt,
    parseNonNegativeNumber,
    parseValidDate,
    isValidUrl
} = require('./helpers');

const registerSchema = {
    name: {
        sanitize: true,
        validate: (v) => isNonEmptyString(v, LIMITS.name),
        message: 'Name is required and must be a valid string (max 100 characters)'
    },
    phone: {
        sanitize: true,
        validate: (v) => typeof v === 'string' && PHONE_REGEX.test(v.trim()),
        message: 'A valid phone number is required (7–20 digits, may include +, spaces, or dashes)'
    },
    email: {
        sanitize: true,
        validate: (v) => typeof v === 'string' && EMAIL_REGEX.test(v.trim().toLowerCase()) && v.length <= LIMITS.email,
        transform: (v) => v.trim().toLowerCase(),
        message: 'A valid email address is required'
    },
    password: {
        sanitize: false,
        validate: (v) => typeof v === 'string' && v.length >= 6 && v.length <= LIMITS.password,
        message: 'Password is required and must be between 6 and 128 characters'
    },
    role: {
        sanitize: true,
        optional: true,
        validate: (v) => !v || ['user', 'organizer'].includes(v),
        transform: (v) => v || 'user',
        message: 'Invalid role. Choose "user" or "organizer"'
    }
};

const loginSchema = {
    email: {
        sanitize: true,
        validate: (v) => typeof v === 'string' && EMAIL_REGEX.test(v.trim().toLowerCase()),
        transform: (v) => v.trim().toLowerCase(),
        message: 'A valid email address is required'
    },
    password: {
        sanitize: false,
        validate: (v) => typeof v === 'string' && v.length > 0 && v.length <= LIMITS.password,
        message: 'Password is required'
    }
};

const eventSchema = {
    title: {
        sanitize: true,
        validate: (v) => isNonEmptyString(v, LIMITS.title),
        message: 'Title is required (max 200 characters)'
    },
    description: {
        sanitize: true,
        validate: (v) => isNonEmptyString(v, LIMITS.description),
        message: 'Description is required (max 5000 characters)'
    },
    thumbnail: {
        sanitize: true,
        validate: isValidUrl,
        message: 'Thumbnail must be a valid HTTP or HTTPS URL'
    },
    location: {
        sanitize: true,
        validate: (v) => isNonEmptyString(v, LIMITS.location),
        message: 'Location is required (max 150 characters)'
    },
    address: {
        sanitize: true,
        validate: (v) => isNonEmptyString(v, LIMITS.address),
        message: 'Address is required (max 300 characters)'
    },
    startDate: {
        sanitize: false,
        validate: (v) => parseValidDate(v) !== null,
        transform: (v) => parseValidDate(v),
        message: 'Start date must be a valid date'
    },
    endDate: {
        sanitize: false,
        validate: (v) => parseValidDate(v) !== null,
        transform: (v) => parseValidDate(v),
        message: 'End date must be a valid date'
    },
    capacity: {
        sanitize: false,
        validate: (v) => parsePositiveInt(v) !== null,
        transform: (v) => parsePositiveInt(v),
        message: 'Capacity must be a positive integer'
    },
    price: {
        sanitize: false,
        optional: true,
        validate: (v) => v === undefined || v === null || parseNonNegativeNumber(v) !== null,
        transform: (v) => (v === undefined || v === null ? 0 : parseNonNegativeNumber(v)),
        message: 'Price must be a non-negative number'
    },
    categoryId: {
        sanitize: false,
        validate: (v) => parsePositiveInt(v) !== null,
        transform: (v) => parsePositiveInt(v),
        message: 'Category ID must be a valid positive integer'
    }
};

const reviewSchema = {
    rating: {
        sanitize: false,
        validate: (v) => {
            const parsed = parsePositiveInt(v);
            return parsed !== null && parsed >= 1 && parsed <= 5;
        },
        transform: (v) => parsePositiveInt(v),
        message: 'Rating must be an integer between 1 and 5'
    },
    comment: {
        sanitize: true,
        optional: true,
        validate: (v) => v === undefined || v === null || v === '' || isNonEmptyString(v, LIMITS.comment),
        transform: (v) => (v ? v.trim() : null),
        message: 'Comment must be a string (max 2000 characters)'
    }
};

function applySchema(body, schema) {
    const errors = [];
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
        let value = body[field];

        if (value === undefined || value === null || value === '') {
            if (rules.optional) {
                if (rules.transform) sanitized[field] = rules.transform(value);
                continue;
            }
            errors.push(rules.message);
            continue;
        }

        if (rules.sanitize && typeof value === 'string') {
            value = sanitizeString(value);
            if (value === null || value === '') {
                if (!rules.optional) {
                    errors.push(rules.message);
                    continue;
                }
            }
        }

        if (!rules.validate(value)) {
            errors.push(rules.message);
            continue;
        }

        sanitized[field] = rules.transform ? rules.transform(value) : (typeof value === 'string' ? value.trim() : value);
    }

    if (sanitized.startDate && sanitized.endDate && sanitized.endDate <= sanitized.startDate) {
        errors.push('End date must be after the start date');
    }

    return { errors, sanitized };
}

module.exports = {
    registerSchema,
    loginSchema,
    eventSchema,
    reviewSchema,
    applySchema
};
