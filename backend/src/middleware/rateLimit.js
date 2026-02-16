import rateLimit from "express-rate-limit";

/**
 * General API limit (all routes)
 * Prevents flooding
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // 200 requests / IP
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth-sensitive routes
 * login / signup / reset
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter
  message: "Too many attempts. Try again later.",
});

/**
 * Forgot password (very strict)
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  message: "Too many reset requests. Try again in 15 min.",
});
