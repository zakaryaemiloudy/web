import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import type { CampagneResponse, GroupeSanguin, StatutCampagne } from '../../../core/models/types';

@Component({
  selector: 'app-donor-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Campagnes de collecte</h2>
        <span class="text-sm text-gray-600">{{ filteredCampagnes().length }} campagne(s)</span>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres et recherche</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              type="text"
              [value]="searchTerm()"
              (input)="searchTerm.set($any($event.target).value)"
              placeholder="Titre ou lieu..."
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Ville/Région</label>
            <input
              type="text"
              [value]="locationFilter()"
              (input)="locationFilter.set($any($event.target).value)"
              placeholder="Ville ou région..."
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Statut</label>
            <select
              [value]="statusFilter()"
              (change)="statusFilter.set($any($event.target).value)"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="PLANIFIEE">Planifiée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </select>
          </div>

          <!-- Blood Type -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Groupe sanguin demandé</label>
            <select
              [value]="bloodTypeFilter()"
              (change)="bloodTypeFilter.set($any($event.target).value)"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tous les groupes</option>
              <option value="A_POSITIF">A Positif</option>
              <option value="A_NEGATIF">A Négatif</option>
              <option value="B_POSITIF">B Positif</option>
              <option value="B_NEGATIF">B Négatif</option>
              <option value="AB_POSITIF">AB Positif</option>
              <option value="AB_NEGATIF">AB Négatif</option>
              <option value="O_POSITIF">O Positif</option>
              <option value="O_NEGATIF">O Négatif</option>
            </select>
          </div>
        </div>

        <!-- Sort -->
        <div class="mt-4">
          <label class="block text-xs font-medium text-gray-700 mb-2">Trier par</label>
          <select
            [value]="sortBy()"
            (change)="sortBy.set($any($event.target).value)"
            class="w-full md:w-48 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="recent">Plus récentes</option>
            <option value="soonest">Commençant bientôt</option>
            <option value="progress">Progression</option>
          </select>
        </div>
      </div>

      <!-- Campaigns Grid -->
      @if (loading()) {
        <p class="text-gray-500 text-center py-8">Chargement des campagnes...</p>
      } @else if (filteredCampagnes().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (campaign of filteredCampagnes(); track campaign.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" (click)="openDetails(campaign)">
              <!-- Campaign Image -->
              @if (campaign.imageUrl) {
                <div class="h-40 bg-gray-200 overflow-hidden">
                  <img [src]="campaign.imageUrl" alt="{{ campaign.titre }}" class="w-full h-full object-cover">
                </div>
              } @else {
                <div class="h-40 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <span class="material-symbols-outlined text-5xl text-red-300">campaign</span>
                </div>
              }

              <!-- Campaign Info -->
              <div class="p-5">
                <!-- Header -->
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ campaign.titre }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ campaign.ville }}, {{ campaign.region }}</p>
                  </div>
                  <span
                    class="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                    [ngClass]="getStatusBadgeClass(campaign.statut)"
                  >
                    {{ getStatusLabel(campaign.statut) }}
                  </span>
                </div>

                <!-- Dates -->
                <p class="text-xs text-gray-600 mb-3">
                  {{ campaign.dateDebut | date:'dd/MM/yyyy' }} - {{ campaign.dateFin | date:'dd/MM/yyyy' }}
                </p>

                <!-- Blood Type & Hospital -->
                <div class="flex items-center gap-2 mb-3">
                  @if (campaign.groupeSanguinCible) {
                    <span class="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      {{ campaign.groupeSanguinCible }}
                    </span>
                  }
                  @if (campaign.hopitalNom) {
                    <span class="text-xs text-gray-600">{{ campaign.hopitalNom }}</span>
                  }
                </div>

                <!-- Progress -->
                <div class="mb-3">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-medium text-gray-700">Progression</span>
                    <span class="text-xs text-gray-600">{{ campaign.progressionPourcentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                      [style.width]="campaign.progressionPourcentage + '%'"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ campaign.nombreParticipants }} / {{ campaign.objectifDonneurs }} donneurs
                  </p>
                </div>

                <!-- Description Preview -->
                <p class="text-xs text-gray-600 line-clamp-2 mb-4">{{ campaign.description }}</p>

                <!-- Action Button -->
                <button
                  (click)="openDetails(campaign); $event.stopPropagation()"
                  class="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12 bg-gray-50 rounded-xl">
          <span class="material-symbols-outlined text-5xl text-gray-300 block mb-3">campaign</span>
          <p class="text-gray-600">Aucune campagne ne correspond à vos filtres</p>
        </div>
      }

      <!-- Details Modal -->
      @if (selectedCampaign(); as campaign) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" (click)="closeDetails()">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-start justify-between">
              <div>
                <h2 class="text-2xl font-bold">{{ campaign.titre }}</h2>
                <p class="text-red-100 mt-1">{{ campaign.ville }}, {{ campaign.region }}</p>
              </div>
              <button (click)="closeDetails()" class="text-red-200 hover:text-white">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
              <!-- Status & Dates -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">Statut</p>
                  <span
                    class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    [ngClass]="getStatusBadgeClass(campaign.statut)"
                  >
                    {{ getStatusLabel(campaign.statut) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Type</p>
                  <span class="textsm font-medium">{{ campaign.nationale ? 'Nationale' : 'Locale' }}</span>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Début</p>
                  <span class="text-sm font-medium">{{ campaign.dateDebut | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Fin</p>
                  <span class="text-sm font-medium">{{ campaign.dateFin | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>

              <!-- Hospital & Blood Type -->
              <div class="border-t pt-4">
                @if (campaign.hopitalNom) {
                  <div class="mb-3">
                    <p class="text-xs text-gray-600 mb-1">Hôpital</p>
                    <p class="font-medium">{{ campaign.hopitalNom }}</p>
                  </div>
                }
                @if (campaign.groupeSanguinCible) {
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Groupe sanguin demandé</p>
                    <span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                      {{ campaign.groupeSanguinCible }}
                    </span>
                  </div>
                }
              </div>

              <!-- Contact Info -->
              @if (campaign.contactInfo) {
                <div class="border-t pt-4">
                  <p class="text-xs text-gray-600 mb-1">Contact</p>
                  <p class="font-medium">{{ campaign.contactInfo }}</p>
                </div>
              }

              <!-- Collection Location -->
              @if (campaign.lieuCollecte) {
                <div class="border-t pt-4">
                  <p class="text-xs text-gray-600 mb-1">Lieu de collecte</p>
                  <p class="font-medium">{{ campaign.lieuCollecte }}</p>
                </div>
              }

              <!-- Description -->
              <div class="border-t pt-4">
                <p class="text-xs text-gray-600 mb-2">Description</p>
                <p class="text-gray-700">{{ campaign.description }}</p>
              </div>

              <!-- Progress Stats -->
              <div class="border-t pt-4 bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-4">Progression de la campagne</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Donneurs</p>
                    <p class="text-2xl font-bold text-red-600">{{ campaign.nombreParticipants }}</p>
                    <p class="text-xs text-gray-500">sur {{ campaign.objectifDonneurs }} objectif</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Quantité collectée</p>
                    <p class="text-2xl font-bold text-red-600">{{ campaign.quantiteCollectee }} ml</p>
                    <p class="text-xs text-gray-500">{{ campaign.nombreDonsCollectes }} dons</p>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-medium text-gray-700">Progression globale</span>
                    <span class="text-xs text-gray-600">{{ campaign.progressionPourcentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                      class="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                      [style.width]="campaign.progressionPourcentage + '%'"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="border-t pt-6 flex gap-3">
                <button
                  (click)="participateCampaign(campaign)"
                  [disabled]="campaign.statut !== 'EN_COURS'"
                  class="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">volunteer_activism</span>
                  {{ campaign.statut === 'EN_COURS' ? 'Participer à la campagne' : 'Campagne ' + getStatusLabel(campaign.statut).toLowerCase() }}
                </button>
                <button
                  (click)="makeDonationRequest(campaign)"
                  [disabled]="campaign.statut !== 'EN_COURS'"
                  class="flex-1 py-3 rounded-lg border border-red-600 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">bloodtype</span>
                  Faire un don maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DonorCampaignsComponent implements OnInit {
  campaigns = signal<CampagneResponse[]>([]);
  selectedCampaign = signal<CampagneResponse | null>(null);
  loading = signal(true);

  // Filter states as signals
  searchTerm = signal('');
  locationFilter = signal('');
  statusFilter = signal('');
  bloodTypeFilter = signal('');
  sortBy = signal('recent');

  filteredCampagnes = computed(() => {
    let filtered = this.campaigns();
    const search = this.searchTerm().toLowerCase();
    const location = this.locationFilter().toLowerCase();
    const status = this.statusFilter();
    const bloodType = this.bloodTypeFilter();
    const sort = this.sortBy();

    // Search by title or location
    if (search) {
      filtered = filtered.filter(
        c =>
          c.titre.toLowerCase().includes(search) ||
          c.lieuCollecte.toLowerCase().includes(search)
      );
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(
        c =>
          c.ville.toLowerCase().includes(location) ||
          c.region.toLowerCase().includes(location)
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(c => c.statut === status);
    }

    // Filter by blood type
    if (bloodType) {
      filtered = filtered.filter(c => c.groupeSanguinCible === bloodType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'soonest':
          return new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
        case 'progress':
          return b.progressionPourcentage - a.progressionPourcentage;
        default: // recent
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      }
    });

    return filtered;
  });

  constructor(private donorApi: DonorApiService) {}

  ngOnInit(): void {
    this.loadCampagnes();
  }

  private loadCampagnes(): void {
    this.loading.set(true);
    this.donorApi.getCampagnes().subscribe({
      next: (campaigns) => {
        this.campaigns.set(campaigns);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openDetails(campaign: CampagneResponse): void {
    this.selectedCampaign.set(campaign);
  }

  closeDetails(): void {
    this.selectedCampaign.set(null);
  }

  participateCampaign(campaign: CampagneResponse): void {
    this.donorApi.participerCampagne(campaign.id).subscribe({
      next: () => {
        alert('Vous avez participé à la campagne avec succès!');
        this.closeDetails();
        this.loadCampagnes();
      },
      error: (err) => {
        alert('Erreur: ' + (err?.error?.message || 'Impossible de participer'));
      },
    });
  }

  makeDonationRequest(campaign: CampagneResponse): void {
    // This would open a donation dialog or navigate to the donation form
    alert('Redirection vers le formulaire de don pour ' + campaign.titre);
    // In a real scenario, you could use a service to navigate or open a modal
  }

  getStatusLabel(status: StatutCampagne): string {
    const labels: Record<StatutCampagne, string> = {
      PLANIFIEE: 'Planifiée',
      EN_COURS: 'En cours',
      TERMINEE: 'Terminée',
      ANNULEA: 'Annulée',
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: StatutCampagne): string {
    switch (status) {
      case 'EN_COURS':
        return 'bg-green-100 text-green-800';
      case 'PLANIFIEE':
        return 'bg-blue-100 text-blue-800';
      case 'TERMINEE':
        return 'bg-gray-100 text-gray-800';
      case 'ANNULEA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
