import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Info,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from '../components/ui/Toast';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  if (error) {
    toast.error('Failed to load lead details');
    navigate('/leads');
  }

  return (
    <PageWrapper title="Lead Context Panel">
      <div className="space-y-6 max-w-4xl">
        {/* Navigation Action header */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/leads')}
            className="shadow-sm border border-slate-200 dark:border-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workspace
          </Button>

          <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Context Workspace
          </span>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-24" count={3} />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        ) : lead ? (
          <div className="space-y-6">
            {/* Lead Brief summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-tr from-brand-500 to-sky-400 text-white rounded-2xl shadow-lg shadow-brand-500/10">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {lead.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge content={lead.status} type="status" className="px-3 py-1 text-xs" />
                <Badge content={lead.source} type="source" className="px-3 py-1 text-xs" />
              </div>
            </div>

            {/* Profile specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-zinc-950/20 text-blue-500 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-500">
                    Acquisition Date
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-purple-50 dark:bg-zinc-950/20 text-purple-500 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-500">
                    Last Updated
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-500">
                    Lead Status Code
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase tracking-wide">
                    {lead.status} Phase
                  </p>
                </div>
              </div>
            </div>

            {/* Client specification Summary notes */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-850 dark:text-zinc-200 flex items-center gap-2 border-b border-slate-50 dark:border-zinc-850/50 pb-4">
                <FileText className="w-5 h-5 text-brand-500" /> Internal Deal Summary
              </h4>

              {lead.notes ? (
                <div className="bg-slate-50 dark:bg-zinc-950/30 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800/50 leading-relaxed text-sm text-slate-650 dark:text-zinc-350 whitespace-pre-wrap font-sans">
                  {lead.notes}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/50 dark:bg-zinc-950/10 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 dark:text-zinc-500 text-sm">
                  No specifications or internal follow-up logs have been registered for this client lead yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No lead context found.
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
