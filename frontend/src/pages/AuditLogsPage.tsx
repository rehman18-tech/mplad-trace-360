import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { History, ShieldCheck, Search, Filter, Lock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAuditLogs().then(setLogs).catch(() => {});
  }, []);

  const filtered = logs.filter(l => 
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_id.toLowerCase().includes(search.toLowerCase()) ||
    l.actor_name.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <History className="w-6 h-6 text-gov-saffron" />
              <span>Immutable Governance Audit Trail & System Logs</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Append-only cryptographic record of all administrative actions, field inspection submissions, anomaly flaggings, and alert resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Cryptographically Sealed (Read-Only)</span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Actor Name, Action, Work ID, or Details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gov-navy"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Timestamp</th>
                <th className="p-3 font-semibold">Actor & Role</th>
                <th className="p-3 font-semibold">Action Event</th>
                <th className="p-3 font-semibold">Entity Ref</th>
                <th className="p-3 font-semibold">Audit Details</th>
                <th className="p-3 font-semibold text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-gov-navy block">{log.actor_name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.actor_role}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-gov-saffron">
                    {log.entity_id}
                  </td>
                  <td className="p-3 text-slate-700 leading-relaxed max-w-md">
                    {log.details}
                  </td>
                  <td className="p-3 text-right font-mono text-[10px] text-slate-400">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
