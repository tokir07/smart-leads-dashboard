import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';
import { useAuthStore } from '../context/authStore';
import { leadsApi } from '../api/leads.api';
import { LeadFilters, LeadStatus, LeadSource, UserRole, Lead } from '../types';
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  FilterX,
  AlertTriangle,
  User,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Zod Schema for Lead Forms
const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional().or(z.literal('')),
});

type LeadFormInput = z.infer<typeof leadFormSchema>;

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  // 1. Search & Filter State
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, sort: 'latest' });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  // 2. Modals State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // 3. React Query Integrations
  const { data, isLoading } = useLeads(filters);
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const leads = data?.data || [];
  const meta = data?.pagination;

  // Merge debounced search into filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // 4. Form Initialization
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      notes: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
  });

  // Load Lead data for Editing
  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setValueEdit('name', lead.name);
    setValueEdit('email', lead.email);
    setValueEdit('status', lead.status);
    setValueEdit('source', lead.source);
    setValueEdit('notes', lead.notes || '');
    setIsEditOpen(true);
  };

  // Load Lead data for Deletion
  const openDeleteModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteOpen(true);
  };

  // 5. Submit Handlers
  const handleAddSubmit = async (data: LeadFormInput) => {
    createLeadMutation.mutate(data, {
      onSuccess: () => {
        toast.success('New lead created successfully!');
        resetAdd();
        setIsAddOpen(false);
      },
      onError: (err: any) => {
        const errMsg = err.response?.data?.error || 'Failed to create lead.';
        toast.error(errMsg);
      },
    });
  };

  const handleEditSubmit = async (data: LeadFormInput) => {
    if (!selectedLead) return;
    updateLeadMutation.mutate(
      { id: selectedLead._id, data },
      {
        onSuccess: () => {
          toast.success('Lead updated successfully!');
          setIsEditOpen(false);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.error || 'Failed to update lead.';
          toast.error(errMsg);
        },
      }
    );
  };

  const handleDeleteSubmit = async () => {
    if (!selectedLead) return;
    deleteLeadMutation.mutate(selectedLead._id, {
      onSuccess: () => {
        toast.success('Lead deleted successfully.');
        setIsDeleteOpen(false);
      },
      onError: (err: any) => {
        const errMsg = err.response?.data?.error || 'Failed to delete lead.';
        toast.error(errMsg);
      },
    });
  };

  const handleCSVExport = async () => {
    if (!isAdmin) return;
    try {
      const res = await leadsApi.exportCSV();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart_leads_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV leads list downloaded successfully!');
    } catch {
      toast.error('Failed to export CSV file.');
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ page: 1, sort: 'latest' });
    toast.info('Workspace filters cleared');
  };

  // Options for Dropdowns
  const statusOptions = [
    { value: LeadStatus.NEW, label: 'New' },
    { value: LeadStatus.CONTACTED, label: 'Contacted' },
    { value: LeadStatus.QUALIFIED, label: 'Qualified' },
    { value: LeadStatus.LOST, label: 'Lost' },
  ];

  const sourceOptions = [
    { value: LeadSource.WEBSITE, label: 'Website' },
    { value: LeadSource.INSTAGRAM, label: 'Instagram' },
    { value: LeadSource.REFERRAL, label: 'Referral' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <PageWrapper title="Leads Workspace">
      <div className="space-y-6">
        {/* Workspace Top actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-zinc-55 mt-1">
              Active Pipeline Grid
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              Manage client records, pipeline status badges, and assign notes inside a central panel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCSVExport}
                className="shadow-sm border border-slate-200 dark:border-zinc-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client Lead
            </Button>
          </div>
        </div>

        {/* Dynamic Filters Control Panel */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between transition-colors">
          {/* Left search inputs */}
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/50 rounded-xl text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Filters Selection grid */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-3 justify-end">
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: (e.target.value as LeadStatus) || undefined, page: 1 }))
              }
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/50 rounded-xl text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={filters.source || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, source: (e.target.value as LeadSource) || undefined, page: 1 }))
              }
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/50 rounded-xl text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Sources</option>
              {sourceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={filters.sort || 'latest'}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: (e.target.value as 'latest' | 'oldest') }))
              }
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/50 rounded-xl text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {(filters.status || filters.source || filters.search || filters.sort !== 'latest') && (
              <button
                onClick={clearFilters}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-550 dark:hover:text-zinc-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-950 flex items-center justify-center border border-dashed border-slate-200 dark:border-zinc-800"
                title="Clear Filters"
              >
                <FilterX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lead Table content area */}
        {isLoading ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-2xl space-y-4">
            <Skeleton className="h-10 w-full" count={8} />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No Client Pipelines Found"
            message="We couldn't locate any lead profiles matching your active sorting criteria."
          />
        ) : (
          <div className="space-y-4">
            <Table headers={['Client Info', 'Status', 'Acquisition Channel', 'Created Date', 'Actions']}>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/10 transition-colors duration-150 cursor-pointer"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-50 dark:bg-zinc-950/20 text-brand-500 rounded-xl border border-brand-100/50 dark:border-zinc-850/50">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 truncate leading-none mt-0.5">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge content={lead.status} type="status" />
                  </td>
                  <td className="px-6 py-4">
                    <Badge content={lead.source} type="source" />
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(lead)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50/50 dark:text-zinc-500 dark:hover:text-brand-400 dark:hover:bg-brand-950/20 transition-all"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => openDeleteModal(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination Controls */}
            {meta && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                hasNextPage={meta.hasNextPage}
                hasPrevPage={meta.hasPrevPage}
              />
            )}
          </div>
        )}

        {/* Modal: Add Lead */}
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Client Lead">
          <form onSubmit={handleSubmitAdd(handleAddSubmit)} className="space-y-4">
            <Input
              label="Client Name"
              placeholder="Enter full name..."
              error={errorsAdd.name?.message}
              {...registerAdd('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="client@company.com"
              error={errorsAdd.email?.message}
              {...registerAdd('email')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Pipeline Status"
                options={statusOptions}
                error={errorsAdd.status?.message}
                {...registerAdd('status')}
              />

              <Select
                label="Source Channel"
                options={sourceOptions}
                error={errorsAdd.source?.message}
                {...registerAdd('source')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Internal Summary Notes
              </label>
              <textarea
                placeholder="Include deal specifications, follow-up timeline, budget options..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 transition-all duration-200"
                {...registerAdd('notes')}
              />
              {errorsAdd.notes && <p className="mt-1 text-xs text-red-500">{errorsAdd.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createLeadMutation.isPending}>
                Create Lead
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Edit Lead */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Client Lead">
          <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
            <Input
              label="Client Name"
              placeholder="Enter full name..."
              error={errorsEdit.name?.message}
              {...registerEdit('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="client@company.com"
              error={errorsEdit.email?.message}
              {...registerEdit('email')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Pipeline Status"
                options={statusOptions}
                error={errorsEdit.status?.message}
                {...registerEdit('status')}
              />

              <Select
                label="Source Channel"
                options={sourceOptions}
                error={errorsEdit.source?.message}
                {...registerEdit('source')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Internal Summary Notes
              </label>
              <textarea
                placeholder="Include deal specifications, follow-up timeline, budget options..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 transition-all duration-200"
                {...registerEdit('notes')}
              />
              {errorsEdit.notes && <p className="mt-1 text-xs text-red-500">{errorsEdit.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateLeadMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Delete Confirmation */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Lead Deletion">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-2xl">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Caution: Destructive Action</p>
                <p className="text-xs opacity-90 mt-0.5">
                  Are you absolutely sure you want to permanently delete the pipeline for{' '}
                  <span className="font-bold">{selectedLead?.name}</span>? This decision is irreversible.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button type="button" variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                No, Keep Lead
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteSubmit}
                isLoading={deleteLeadMutation.isPending}
              >
                Yes, Delete Record
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};
