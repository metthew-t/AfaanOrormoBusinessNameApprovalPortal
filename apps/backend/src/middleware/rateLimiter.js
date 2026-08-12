// apps/backend/src/middleware/rateLimiter.js
// Rate limiting middleware — applied per spec §22

const rateLimit = require('express-rate-limit');

/** General API rate limit */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Gaaffii baay\'ee erguuf yaalteetta. Daqiiqaa muraasa booda irra deebi\'ii yaalii.',
    errors: [],
  },
});

/** Stricter limit for auth endpoints */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Seenuu ykn galmaahuu irra deddeebi\'iiti yaalteetta. Daqiiqaa 15 booda irra deebi\'ii yaalii.',
    errors: [],
  },
});

/** Public search limit */
const publicSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Barbaaduu irra deddeebi\'iiti taatee jira. Yerootti booda irra deebi\'ii yaalii.',
    errors: [],
  },
});

module.exports = { generalLimiter, authLimiter, publicSearchLimiter };
