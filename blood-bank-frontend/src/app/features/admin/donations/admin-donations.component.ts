import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import type { DonResponse } from '../../../core/models/types';

@Component({
  selector: 'app-admin-donations',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, BloodTypeBadgeComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Gestion des dons</h2>
      </div>

      @if (loading()) {
        <p class="text-gray-500">Chargement...</p>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Donneur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Groupe</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Quantité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Campagne</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (don of donations(); track don.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ don.donneurNom }} {{ don.donneurPrenom }}</td>
                    <td class="px-6 py-4 text-sm">
                      <app-blood-type-badge [groupeSanguin]="don.groupeSanguin" />
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ don.quantiteMl }} ml</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ don.campagneTitre || 'Hôpital' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ don.dateDon | date:'short' }}</td>
                    <td class="px-6 py-4">
                      <app-status-badge [status]="don.statut" />
                    </td>
                    <td class="px-6 py-4 text-right text-sm space-x-2">
                      @if (don.statut === 'EN_ATTENTE') {
                        <button
                          (click)="validerDon(don.id)"
                          [disabled]="validatingId() === don.id"
                          class="text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded disabled:opacity-50"
                        >
                          {{ validatingId() === don.id ? 'Validation...' : 'Valider' }}
                        </button>
                        <button
                          (click)="openRejectDialog(don.id)"
                          class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded"
                        >
                          Rejeter
                        </button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="px-6 py-8 text-sm text-gray-500 text-center">Aucun don trouvé</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reject Modal -->
        @if (showRejectModal()) {
          <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Rejeter le don</h3>
              <textarea
                [(ngModel)]="rejectReason"
                placeholder="Raison du rejet..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                rows="4"
              ></textarea>
              <div class="flex gap-3 justify-end">
                <button
                  (click)="closeRejectModal()"
                  class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  (click)="confirmReject()"
                  [disabled]="!rejectReason.trim()"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class AdminDonationsComponent implements OnInit {
  donations = signal<DonResponse[]>([]);
  loading = signal(true);
  validatingId = signal<number | null>(null);
  showRejectModal = signal(false);
  rejectingId: number | null = null;
  rejectReason = '';

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  private loadDonations(): void {
    this.adminApi.getDons().subscribe({
      next: (data) => this.donations.set(data),
      complete: () => this.loading.set(false),
    });
  }

  validerDon(id: number): void {
    this.validatingId.set(id);
    this.adminApi.validerDon(id).subscribe({
      next: () => {
        this.donations.update((list) =>
          list.map((d) => (d.id === id ? { ...d, statut: 'VALIDE' } : d))
        );
      },
      error: (err) => console.error('Erreur lors de la validation:', err),
      complete: () => this.validatingId.set(null),
    });
  }

  openRejectDialog(id: number): void {
    this.rejectingId = id;
    this.rejectReason = '';
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
    this.rejectReason = '';
    this.rejectingId = null;
  }

  confirmReject(): void {
    if (!this.rejectingId || !this.rejectReason.trim()) return;

    this.validatingId.set(this.rejectingId);
    this.adminApi.rejeterDon(this.rejectingId, this.rejectReason).subscribe({
      next: () => {
        this.donations.update((list) =>
          list.map((d) =>
            d.id === this.rejectingId ? { ...d, statut: 'REJETE' } : d
          )
        );
        this.closeRejectModal();
      },
      error: (err) => console.error('Erreur lors du rejet:', err),
      complete: () => this.validatingId.set(null),
    });
  }
}
