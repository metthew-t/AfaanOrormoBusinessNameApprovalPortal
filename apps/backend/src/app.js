// apps/backend/src/app.js
// Express application setup — mounts all routes, middleware, and error handlers.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// ─── Route imports ───────────────────────────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
const applicationRoutes = require('./modules/businessApplications/businessApplications.routes');
const businessNameRoutes = require('./modules/businessNames/businessNames.routes');
const permissionRoutes = require('./modules/permissions/permissions.routes');
const languageReviewRoutes = require('./modules/languageReviews/languageReviews.routes');
const certificateRoutes = require('./modules/certificates/certificates.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const publicRoutes = require('./modules/publicVerification/publicVerification.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const communicationRoutes = require('./modules/communication/communication.routes');
const turizmRoutes = require('./modules/turizm/turizm.routes');
const commercialRoutes = require('./modules/commercial/commercial.routes');

// ─── App initialization ──────────────────────────────────────────────────────
const app = express();

// ─── Security & Parsing Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isDev ? 'dev' : 'combined'));
app.use(generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AOBNAP Backend is running.',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
// Auth
app.use('/api/auth', authRoutes);

// Business Applications
app.use('/api/applications', applicationRoutes);

// Business Name Validation
app.use('/api/business-names', businessNameRoutes);

// Permissions (Financial Officer)
app.use('/api/permissions', permissionRoutes);

// Language Reviews (Language Officer)
app.use('/api/language-reviews', languageReviewRoutes);

// Certificates
app.use('/api/certificates', certificateRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);

// Public (no auth)
app.use('/api/public', publicRoutes);

// Admin
app.use('/api/admin', adminRoutes);

// Communication Biro (FINANCIAL_OFFICER)
app.use('/api/communication', communicationRoutes);

// Addaf Turizm Biro (LANGUAGE_OFFICER)
app.use('/api/turizm', turizmRoutes);

// Commercial Office (SENIOR_OFFICER)
app.use('/api/commercial', commercialRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Karoorri ${req.method} ${req.path} hin argamne.`,
    errors: [],
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
