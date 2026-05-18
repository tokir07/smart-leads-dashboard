import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AuthRequest, UserRole, ILead } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { generateCSV } from '../utils/csv.utils';

// GET /leads — with full filter, search, sort, pagination
export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = req.query;

    const filter: Record<string, unknown> = {};

    // Role-based filter: sales users only see their leads
    if (req.user?.role === UserRole.SALES) {
      filter.createdBy = req.user.id;
    }
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /leads — create
export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      notes,
      assignedTo: assignedTo || undefined,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

// GET /leads/:id — single lead
export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    // Role check: sales can only see their own leads
    if (req.user.role === UserRole.SALES && lead.createdBy.toString() !== req.user.id) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /leads/:id — update
export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    // Role check: sales can only update their own leads
    if (req.user.role === UserRole.SALES && lead.createdBy.toString() !== req.user.id) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    const { name, email, status, source, notes, assignedTo } = req.body;

    lead.name = name ?? lead.name;
    lead.email = email ?? lead.email;
    lead.status = status ?? lead.status;
    lead.source = source ?? lead.source;
    lead.notes = notes ?? lead.notes;
    if (assignedTo !== undefined) {
      lead.assignedTo = assignedTo || undefined;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /leads/:id — delete (admin only)
export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    // Double check: admin only can delete (middleware does this, but keeping here for extra safety)
    if (req.user.role !== UserRole.ADMIN) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// GET /leads/export/csv — CSV export (admin only)
export const exportLeadsCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only Admin can export CSV (double check)
    if (req.user?.role !== UserRole.ADMIN) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean() as unknown as ILead[];
    const csv = generateCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
