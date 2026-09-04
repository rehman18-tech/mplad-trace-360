import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Project, Contractor, Alert, Complaint, Dispute, Guarantee, DelayPrediction } from '../types';

export const queryKeys = {
  projects: (filters?: any) => ['projects', filters] as const,
  projectDetail: (id: string) => ['project', id] as const,
  contractors: () => ['contractors'] as const,
  contractorDetail: (id: string) => ['contractor', id] as const,
  alerts: () => ['alerts'] as const,
  complaints: (projectId?: string) => ['complaints', projectId] as const,
  analytics: () => ['analytics'] as const,
  disputes: () => ['disputes'] as const,
  guarantees: () => ['guarantees'] as const,
};

export function useProjects(filters?: any) {
  return useQuery({
    queryKey: queryKeys.projects(filters),
    queryFn: () => api.getProjects(filters),
  });
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.projectDetail(id),
    queryFn: () => api.getProjectById(id),
    enabled: Boolean(id),
  });
}

export function useContractors() {
  return useQuery({
    queryKey: queryKeys.contractors(),
    queryFn: () => api.getContractors(),
  });
}

export function useContractorDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.contractorDetail(id),
    queryFn: () => api.getContractorById(id),
    enabled: Boolean(id),
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts(),
    queryFn: () => api.getAlerts(),
  });
}

export function useComplaints(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.complaints(projectId),
    queryFn: async () => {
      const all = await api.getComplaints();
      return projectId ? all.filter(c => c.project_id === projectId) : all;
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics(),
    queryFn: () => api.getOverviewAnalytics(),
  });
}

export function useDisputes() {
  return useQuery({
    queryKey: queryKeys.disputes(),
    queryFn: () => api.getDisputes(),
  });
}

export function useGuarantees() {
  return useQuery({
    queryKey: queryKeys.guarantees(),
    queryFn: () => api.getGuarantees(),
  });
}

export function useSubmitInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.submitInspection(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectDetail(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
  });
}

export function useSubmitComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.submitComplaint(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => api.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
  });
}
