import { Component, OnInit, signal, computed } from '@angular/core';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import type { HopitalResponse } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Gestion des hôpitaux</h2>
      </div>

      <div class="flex gap-3 border-b border-gray-200">
        <button
          type="button"
          (click)="activeTab.set('all')"
          class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
          [class.bg-white]="activeTab() === 'all'"
          [class.text-red-600]="activeTab() === 'all'"
          [class.border]="activeTab() === 'all'"
          [class.border-b-0]="activeTab() === 'all'"
          [class.border-gray-200]="activeTab() === 'all'"
          [class.-mb-px]="activeTab() === 'all'"
          [class.text-gray-600]="activeTab() !== 'all'"
          [class.hover:bg-gray-50]="activeTab() !== 'all'"
        >
          Tous
        </button>
        <button
          type="button"
          (click)="activeTab.set('pending')"
          class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
          [class.bg-white]="activeTab() === 'pending'"
          [class.text-red-600]="activeTab() === 'pending'"
          [class.border]="activeTab() === 'pending'"
          [class.border-b-0]="activeTab() === 'pending'"
          [class.border-gray-200]="activeTab() === 'pending'"
          [class.-mb-px]="activeTab() === 'pending'"
          [class.text-gray-600]="activeTab() !== 'pending'"
          [class.hover:bg-gray-50]="activeTab() !== 'pending'"
        >
          En attente de validation
        </button>
      </div>

      @if (loading()) {
        <p class="text-gray-500">Chargement des hôpitaux...</p>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <p class="text-sm text-gray-700">
              {{ filteredHopitaux().length }} hôpital(s)
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Ville</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Région</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Capacité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                @for (h of filteredHopitaux(); track h.id) {
                  <tr>
                    <td class="px-6 py-3 text-sm text-gray-900">
                      {{ h.nom }}
                    </td>
                    <td class="px-6 py-3 text-sm text-gray-600">
                      {{ h.ville }}
                    </td>
                    <td class="px-6 py-3 text-sm text-gray-600">
                      {{ h.region }}
                    </td>
                    <td class="px-6 py-3 text-sm text-gray-600">
                      {{ h.capaciteStockage }} unités
                    </td>
                    <td class="px-6 py-3 text-sm">
                      <app-status-badge [status]="h.statut" />
                    </td>
                    <td class="px-6 py-3 text-right text-sm">
                      <div class="inline-flex gap-2">
                        @if (h.statut === 'EN_ATTENTE') {
                          <button
                            type="button"
                            (click)="valider(h)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                          >
                            Valider
                          </button>
                        }
                        @if (h.statut === 'VALIDE') {
                          <button
                            type="button"
                            (click)="suspendre(h)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                          >
                            Suspendre
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-6 text-center text-sm text-gray-500">
                      Aucun hôpital à afficher.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class HospitalsComponent implements OnInit {
  hopitaux = signal<HopitalResponse[]>([]);
  hopitauxEnAttente = signal<HopitalResponse[]>([]);
  loading = signal(true);
  activeTab = signal<'all' | 'pending'>('all');

  filteredHopitaux = computed(() => {
    const tab = this.activeTab();
    if (tab === 'pending') {
      return this.hopitauxEnAttente();
    }
    return this.hopitaux();
  });

  constructor(private superAdminApi: SuperAdminApiService) {}

  ngOnInit(): void {
    this.superAdminApi.getHopitaux().subscribe({
      next: (list) => this.hopitaux.set(list),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });

    this.superAdminApi.getHopitauxEnAttente().subscribe({
      next: (list) => this.hopitauxEnAttente.set(list),
      error: () => {},
    });
  }

  valider(h: HopitalResponse): void {
    this.superAdminApi.validerHopital(h.id).subscribe({
      next: (updated) => {
        this.hopitaux.update((list) =>
          list.map((x) => (x.id === updated.id ? updated : x))
        );
        this.hopitauxEnAttente.update((list) =>
          list.filter((x) => x.id !== updated.id)
        );
      },
    });
  }

  suspendre(h: HopitalResponse): void {
    this.superAdminApi.suspendreHopital(h.id).subscribe({
      next: (updated) => {
        this.hopitaux.update((list) =>
          list.map((x) => (x.id === updated.id ? updated : x))
        );
      },
    });
  }
}
