const LIMITS = {
    name: 100,
    email: 254,
    phone: 20,
    password: 128,
    title: 200,
    description: 5000,
    location: 150,
    address: 300,
    comment: 2000,
    url: 2048
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-().]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+/i;

function sanitizeString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'string') return null;
    return value
        .trim()
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/<[^>]*>/g, '');
}

function isNonEmptyString(value, maxLength) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
}

function parsePositiveInt(value) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) return null;
    return parsed;
}

function parseNonNegativeNumber(value) {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return null;
    return parsed;
}

function parseValidDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date;
}

function isValidUrl(value) {
    if (!isNonEmptyString(value, LIMITS.url)) return false;
    if (!URL_REGEX.test(value)) return false;
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol);
    } catch {
        return false;
    }
}

function fail(res, message, errors = null) {
    const payload = { message };
    if (errors && errors.length > 1) payload.errors = errors;
    return res.status(400).json(payload);
}

module.exports = {
    LIMITS,
    EMAIL_REGEX,
    PHONE_REGEX,
    sanitizeString,
    isNonEmptyString,
    parsePositiveInt,
    parseNonNegativeNumber,
    parseValidDate,
    isValidUrl,
    fail
};
