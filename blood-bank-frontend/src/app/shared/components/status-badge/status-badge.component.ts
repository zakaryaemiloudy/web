import { Component, input, computed } from '@angular/core';

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
  UTILISE: 'Utilisé',
  PERIME: 'Périmé',
  EN_COURS: 'En cours',
  SATISFAITE: 'Satisfaite',
  ANNULEE: 'Annulée',
  REJETEE: 'Rejetée',
  CRITIQUE: 'Critique',
  HAUTE: 'Haute',
  NORMALE: 'Normale',
  ELEVE: 'Élevé',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      [class]="badgeClass()"
    >
      {{ displayLabel() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  /** One of: StatutDon, StatutDemande, Urgence, NiveauStock, or custom string */
  status = input.required<string>();
  /** Optional override for display text */
  label = input<string | null>(null);

  displayLabel = computed(() => this.label() ?? STATUS_LABELS[this.status().toUpperCase()] ?? this.status());

  badgeClass = () => {
    const s = this.status().toUpperCase();
    const l = this.label();
    if (l) return this.classFor(l);
    // StatutDon
    if (s === 'EN_ATTENTE') return 'bg-amber-100 text-amber-800';
    if (s === 'VALIDE') return 'bg-green-100 text-green-800';
    if (s === 'REJETE') return 'bg-red-100 text-red-800';
    if (s === 'UTILISE') return 'bg-blue-100 text-blue-800';
    if (s === 'PERIME') return 'bg-gray-100 text-gray-800';
    // StatutDemande
    if (s === 'EN_COURS') return 'bg-blue-100 text-blue-800';
    if (s === 'SATISFAITE') return 'bg-green-100 text-green-800';
    if (s === 'ANNULEE' || s === 'REJETEE') return 'bg-gray-100 text-gray-700';
    // Urgence
    if (s === 'CRITIQUE') return 'bg-red-100 text-red-700 animate-pulse';
    if (s === 'HAUTE') return 'bg-orange-100 text-orange-800';
    if (s === 'NORMALE') return 'bg-sky-100 text-sky-800';
    // NiveauStock
    if (s === 'CRITIQUE') return 'bg-red-100 text-red-700';
    if (s === 'ELEVE') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-700';
  };

  private classFor(label: string): string {
    if (label.toLowerCase().includes('critique')) return 'bg-red-100 text-red-700 animate-pulse';
    if (label.toLowerCase().includes('urgent')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-700';
  }
}
