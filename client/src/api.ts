import type { Condition, Symptom } from './types';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const getConditions = (params: Record<string, string> = {}): Promise<Condition[]> =>
  request<Condition[]>(`/conditions?${new URLSearchParams(params)}`);

export const getCondition = (id: string): Promise<Condition> =>
  request<Condition>(`/conditions/${encodeURIComponent(id)}`);

export const getSymptoms = (): Promise<Symptom[]> => request<Symptom[]>('/symptoms');