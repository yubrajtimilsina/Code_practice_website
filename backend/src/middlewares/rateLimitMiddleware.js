import rateLimit from 'express-rate-limit';

export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  message: 'Too many submissions. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});