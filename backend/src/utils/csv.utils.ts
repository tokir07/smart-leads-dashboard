import { ILead } from '../types';

export const generateCSV = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.status,
    l.source,
    new Date(l.createdAt).toLocaleDateString(),
  ]);
  return [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
};
