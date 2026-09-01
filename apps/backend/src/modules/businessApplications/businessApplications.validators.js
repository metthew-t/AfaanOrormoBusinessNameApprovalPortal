// apps/backend/src/modules/businessApplications/businessApplications.validators.js

const { body } = require('express-validator');

const createApplicationValidator = [
  body('proposedBusinessName').trim().notEmpty().withMessage('Maqaan daldalaa galchi.').isLength({ min: 2, max: 100 }),
  body('businessCategoryId').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    if (!Number.isInteger(parseInt(value, 10)) || parseInt(value, 10) < 1) {
      throw new Error('Gosa daldalaa sirrii filadhu.');
    }
    return true;
  }),
  body('businessDescription').trim().notEmpty().withMessage('Ibsa daldalaa galchi.').isLength({ max: 500 }),
  body('businessAddress').trim().notEmpty().withMessage('Teessuma daldalaa galchi.').isLength({ max: 200 }),
];

const updateApplicationValidator = [
  body('proposedBusinessName').optional().trim().isLength({ min: 2, max: 100 }),
  body('businessCategoryId').optional({ nullable: true }).custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    if (!Number.isInteger(parseInt(value, 10)) || parseInt(value, 10) < 1) {
      throw new Error('Gosa daldalaa sirrii filadhu.');
    }
    return true;
  }),
  body('businessDescription').optional().trim().isLength({ max: 500 }),
  body('businessAddress').optional().trim().isLength({ max: 200 }),
];

const correctionValidator = [
  body('correctionNote').optional().trim().isLength({ max: 500 }),
  body('proposedBusinessName').optional().trim().isLength({ min: 2, max: 100 }),
];

module.exports = { createApplicationValidator, updateApplicationValidator, correctionValidator };
