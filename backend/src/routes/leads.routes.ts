import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leads.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../validators/leads.validator';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Export CSV - Admin only (Declared BEFORE dynamic /:id route to prevent pattern clash)
router.get('/export/csv', authorizeRoles(UserRole.ADMIN), exportLeadsCSV);

// Base leads actions
router.get('/', getLeads);
router.post('/', validate(createLeadSchema), createLead);

// Single lead actions
router.get('/:id', getLeadById);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteLead);

export default router;
