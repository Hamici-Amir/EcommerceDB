import express from "express";
import crypto from "crypto";

const router = express.Router();

// Store admin sessions (in production, use Redis or database)
const adminSessions = new Map();

// Generate CSRF token
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Admin login endpoint
router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ message: "Admin password not configured" });
  }

  if (password === adminPassword) {
    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const csrfToken = generateCSRFToken();
    
    // Store session
    adminSessions.set(sessionToken, {
      csrfToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    // Set session cookie
    res.cookie('adminSession', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    res.status(200).json({ 
      message: "Login successful",
      csrfToken 
    });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// Check admin session status
router.get("/check-session", (req, res) => {
  const sessionToken = req.cookies.adminSession;
  
  if (!sessionToken) {
    return res.status(401).json({ message: "No session found" });
  }

  const session = adminSessions.get(sessionToken);
  
  if (!session) {
    return res.status(401).json({ message: "Invalid session" });
  }

  // Check if session expired
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(sessionToken);
    res.clearCookie('adminSession');
    return res.status(401).json({ message: "Session expired" });
  }

  res.status(200).json({ 
    message: "Session valid",
    csrfToken: session.csrfToken
  });
});

// Logout endpoint
router.post("/logout", (req, res) => {
  const sessionToken = req.cookies.adminSession;
  
  if (sessionToken) {
    adminSessions.delete(sessionToken);
  }
  
  res.clearCookie('adminSession');
  res.status(200).json({ message: "Logged out successfully" });
});

// Middleware to verify admin session
export const verifyAdminSession = (req, res, next) => {
  const sessionToken = req.cookies.adminSession;
  
  if (!sessionToken) {
    return res.status(401).json({ message: "No session found" });
  }

  const session = adminSessions.get(sessionToken);
  
  if (!session) {
    return res.status(401).json({ message: "Invalid session" });
  }

  // Check if session expired
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(sessionToken);
    res.clearCookie('adminSession');
    return res.status(401).json({ message: "Session expired" });
  }

  // Add session info to request
  req.adminSession = session;
  next();
};

// Middleware to verify CSRF token
export const verifyCSRFToken = (req, res, next) => {
  const sessionToken = req.cookies.adminSession;
  const csrfToken = req.headers['x-csrf-token'];
  
  if (!sessionToken || !csrfToken) {
    return res.status(401).json({ message: "Missing session or CSRF token" });
  }

  const session = adminSessions.get(sessionToken);
  
  if (!session || session.csrfToken !== csrfToken) {
    return res.status(401).json({ message: "Invalid CSRF token" });
  }

  next();
};

export default router; 