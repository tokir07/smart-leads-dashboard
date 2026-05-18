import React from 'react';
import { useLeads } from '../hooks/useLeads';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Globe,
  Instagram,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { LeadStatus, LeadSource } from '../types';

export const DashboardPage: React.FC = () => {
  // Query 1000 leads to compute dashboard statistics
  const { data, isLoading } = useLeads({ limit: 1000 });
  const leads = data?.data || [];

  // 1. Metric Counts
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === LeadStatus.NEW).length;
  const contactedLeads = leads.filter((l) => l.status === LeadStatus.CONTACTED).length;
  const qualifiedLeads = leads.filter((l) => l.status === LeadStatus.QUALIFIED).length;
  const lostLeads = leads.filter((l) => l.status === LeadStatus.LOST).length;

  // 2. Sources Counts
  const websiteLeads = leads.filter((l) => l.source === LeadSource.WEBSITE).length;
  const instagramLeads = leads.filter((l) => l.source === LeadSource.INSTAGRAM).length;
  const referralLeads = leads.filter((l) => l.source === LeadSource.REFERRAL).length;

  // 3. Assignees Counts
  const assignedCount = leads.filter((l) => l.assignedTo).length;
  const unassignedCount = totalLeads - assignedCount;

  // 4. Recent Leads (limit to 5)
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getPercent = (value: number) => {
    if (totalLeads === 0) return 0;
    return Math.round((value / totalLeads) * 100);
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users className="w-6 h-6 text-brand-500" />,
      gradient: 'from-brand-500/10 to-sky-500/5 dark:from-brand-500/20 dark:to-sky-500/5',
      border: 'border-brand-500/20',
    },
    {
      title: 'New Leads',
      value: newLeads,
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      gradient: 'from-blue-500/10 to-indigo-500/5 dark:from-blue-500/20 dark:to-indigo-500/5',
      border: 'border-blue-500/20',
    },
    {
      title: 'Contacted',
      value: contactedLeads,
      icon: <PhoneCall className="w-6 h-6 text-amber-500" />,
      gradient: 'from-amber-500/10 to-yellow-500/5 dark:from-amber-500/20 dark:to-yellow-500/5',
      border: 'border-amber-500/20',
    },
    {
      title: 'Qualified',
      value: qualifiedLeads,
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      gradient: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/5',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Lost Leads',
      value: lostLeads,
      icon: <XCircle className="w-6 h-6 text-rose-500" />,
      gradient: 'from-rose-500/10 to-red-500/5 dark:from-rose-500/20 dark:to-red-500/5',
      border: 'border-rose-500/20',
    },
  ];

  return (
    <PageWrapper title="Sales Intelligence Hub">
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          {/* Skeletons for Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Skeleton className="h-28" count={5} />
          </div>
          {/* Skeletons for Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hero Welcome banner */}
          <div className="p-6 bg-gradient-to-r from-brand-650 to-brand-600 dark:from-zinc-900 dark:to-zinc-850 border border-slate-100 dark:border-zinc-800 rounded-3xl text-white shadow-xl shadow-brand-500/5 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-white/10 to-transparent blur-3xl pointer-events-none" />
            <div>
              <h3 className="text-2xl font-black font-sans leading-tight">
                Welcome to Smart Leads
              </h3>
              <p className="text-sm text-brand-100 dark:text-zinc-400 mt-1 max-w-xl">
                Real-time pipeline monitoring, client assignment dashboards, and source channel performance metrics are now up-to-date.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                <p className="text-[10px] text-brand-200 dark:text-zinc-500 uppercase font-black tracking-widest leading-none">
                  Pipeline Health
                </p>
                <p className="text-lg font-black mt-1">
                  {totalLeads > 0 ? getPercent(qualifiedLeads) : 0}% Conversion
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {statCards.map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.gradient} bg-white dark:bg-zinc-900 border ${card.border} p-6 rounded-2xl shadow-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300 flex flex-col justify-between h-32 relative group overflow-hidden`}
              >
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/5 dark:bg-black/5 rounded-full scale-100 group-hover:scale-150 transition-all duration-300" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  {card.icon}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-800 dark:text-zinc-50 font-sans tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                    leads ({getPercent(card.value)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline breakdown + Sources Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lead Sources Distribution */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm">
              <h4 className="text-base font-bold text-slate-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-500" /> Lead Acquisition Channels
              </h4>

              <div className="space-y-6">
                {/* Website Bar */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600 dark:text-zinc-355 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-cyan-500" /> Direct Website
                    </span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {websiteLeads} <span className="text-slate-400 font-normal">({getPercent(websiteLeads)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${getPercent(websiteLeads)}%` }}
                    />
                  </div>
                </div>

                {/* Instagram Bar */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600 dark:text-zinc-355 flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-fuchsia-500" /> Instagram Campaigns
                    </span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {instagramLeads} <span className="text-slate-400 font-normal">({getPercent(instagramLeads)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 rounded-full transition-all duration-1000"
                      style={{ width: `${getPercent(instagramLeads)}%` }}
                    />
                  </div>
                </div>

                {/* Referral Bar */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600 dark:text-zinc-355 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-500" /> Direct Referral
                    </span>
                    <span className="text-slate-800 dark:text-zinc-200">
                      {referralLeads} <span className="text-slate-400 font-normal">({getPercent(referralLeads)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${getPercent(referralLeads)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment health indicator */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-6">
                <div className="flex-1 flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-950/20 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">
                      Assigned Pipelines
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {assignedCount} leads assigned ({getPercent(assignedCount)}%)
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-950/20 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">
                      Unassigned Pipelines
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {unassignedCount} leads unassigned ({getPercent(unassignedCount)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Leads list */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm">
              <h4 className="text-base font-bold text-slate-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" /> Recent Activities
              </h4>

              {recentLeads.length === 0 ? (
                <div className="text-center py-8 text-slate-450 dark:text-zinc-500 text-sm">
                  No active pipelines available.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-zinc-850/50 hover:bg-slate-50/50 dark:hover:bg-zinc-850/20 transition-all duration-200"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="text-sm font-bold text-slate-850 dark:text-zinc-250 truncate">
                          {lead.name}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-550 block mt-0.5 truncate">
                          {lead.email}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge content={lead.status} type="status" />
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
