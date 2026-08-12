// apps/backend/src/modules/auth/auth.validators.js

const { body } = require('express-validator');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Maqaan guutuu barbaachisaa dha.').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Imeelii sirrii galchi.').normalizeEmail(),
  body('phoneNumber').optional().isMobilePhone().withMessage('Lakkoofsa bilbilaa sirrii galchi.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Jecha icciitii hir\'ata qubee 8 qabaachuu qaba.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Jecha icciitii qubee fi lakkoofsa qabaachuu qaba.'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Imeelii sirrii galchi.').normalizeEmail(),
  body('password').notEmpty().withMessage('Jecha icciitii galchi.'),
];

const verifyNationalIdValidator = [
  body('nationalIdNumber').trim().notEmpty().withMessage('Lakkoofsa eenyummaa galchi.').isLength({ min: 6, max: 20 }),
  body('applicationId').optional().isInt({ min: 1 }),
];

module.exports = { registerValidator, loginValidator, verifyNationalIdValidator };
