import type { GroupeSanguin } from '../../core/models/types';

export const BLOOD_GROUP_LABELS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
};

export function bloodGroupLabel(g: GroupeSanguin): string {
  return BLOOD_GROUP_LABELS[g] ?? g;
}

export function bloodGroupBgClass(g: GroupeSanguin): string {
  if (g.startsWith('A_')) return 'bg-red-50 text-red-600';
  if (g.startsWith('B_')) return 'bg-blue-50 text-blue-600';
  if (g.startsWith('AB_')) return 'bg-purple-50 text-purple-600';
  if (g.startsWith('O_')) return 'bg-orange-50 text-orange-600';
  return 'bg-gray-100 text-gray-600';
}
