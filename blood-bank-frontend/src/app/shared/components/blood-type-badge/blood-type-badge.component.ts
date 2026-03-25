import { Component, input, computed } from '@angular/core';
import type { GroupeSanguin } from '../../../core/models/types';

const LABELS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
};

const BG_CLASS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'bg-red-50 text-red-600',
  A_NEGATIF: 'bg-red-100 text-red-700',
  B_POSITIF: 'bg-blue-50 text-blue-600',
  B_NEGATIF: 'bg-blue-100 text-blue-700',
  AB_POSITIF: 'bg-purple-50 text-purple-600',
  AB_NEGATIF: 'bg-purple-100 text-purple-700',
  O_POSITIF: 'bg-orange-50 text-orange-600',
  O_NEGATIF: 'bg-orange-100 text-orange-700',
};

@Component({
  selector: 'app-blood-type-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm shrink-0"
      [class]="bgClass()"
    >
      {{ displayLabel() }}
    </span>
  `,
})
export class BloodTypeBadgeComponent {
  groupeSanguin = input.required<GroupeSanguin>();

  displayLabel = computed(() => LABELS[this.groupeSanguin()] ?? this.groupeSanguin());
  bgClass = computed(() => BG_CLASS[this.groupeSanguin()] ?? 'bg-gray-100 text-gray-600');
}
