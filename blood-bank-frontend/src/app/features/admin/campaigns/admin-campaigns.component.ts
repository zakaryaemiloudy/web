import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { CampagneResponse, StatutCampagne } from '../../../core/models/types';

@Component({
  selector: 'app-admin-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Gestion des campagnes</h2>
        <div class="flex gap-2">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {{ campaigns().length }} campagnes
          </span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Campaigns -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Total Campagnes</p>
              <p class="text-3xl font-bold text-blue-900 mt-1">{{ campaigns().length }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-blue-300">campaign</span>
          </div>
        </div>

        <!-- Active Campaigns -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">En cours</p>
              <p class="text-3xl font-bold text-green-900 mt-1">{{ getActiveCampaignsCount() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-green-300">check_circle</span>
          </div>
        </div>

        <!-- Total Participants -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-600 font-medium">Participants</p>
              <p class="text-3xl font-bold text-purple-900 mt-1">{{ getTotalParticipants() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-purple-300">groups</span>
          </div>
        </div>

        <!-- Total Collected -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-600 font-medium">Collectés</p>
              <p class="text-3xl font-bold text-red-900 mt-1">{{ getTotalCollected() }} ml</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-red-300">bloodtype</span>
          </div>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Titre ou ville..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              [(ngModel)]="selectedStatus"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="PLANIFIEE">Planifiée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEA">Annulée</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              [(ngModel)]="selectedType"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="nationale">Nationale</option>
              <option value="locale">Locale</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Région</label>
            <select
              [(ngModel)]="selectedRegion"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les régions</option>
              @for (region of getRegions(); track region) {
                <option [value]="region">{{ region }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <!-- Campaigns List -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <p class="text-gray-500">Chargement des campagnes...</p>
        </div>
      } @else if (getFilteredCampaigns().length === 0) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-300 block mb-2">campaign</span>
          <p class="text-gray-500">Aucune campagne trouvée</p>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collecté</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progression</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (campaign of getFilteredCampaigns(); track campaign.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div>
                        <p class="font-medium text-gray-900">{{ campaign.titre }}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          @if (campaign.nationale) {
                            <span class="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Nationale</span>
                          } @else {
                            <span class="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Locale</span>
                          }
                        </p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p class="font-medium">{{ campaign.ville }}</p>
                        <p class="text-xs text-gray-500">{{ campaign.region }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p>{{ campaign.dateDebut | date:'short' }}</p>
                        <p class="text-xs text-gray-500">à {{ campaign.dateFin | date:'short' }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-center">
                        <p class="font-semibold text-gray-900">{{ campaign.nombreParticipants }}</p>
                        <p class="text-xs text-gray-500">/ {{ campaign.objectifDonneurs }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-center">
                        <p class="font-semibold text-red-600">{{ campaign.quantiteCollectee }} ml</p>
                        <p class="text-xs text-gray-500">{{ campaign.nombreDonsCollectes }} dons</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="w-32">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-xs font-medium text-gray-700">{{ campaign.progressionPourcentage }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-blue-500 h-2 rounded-full transition-all"
                            [style.width]="campaign.progressionPourcentage + '%'"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        [class.bg-yellow-100]="campaign.statut === 'PLANIFIEE'"
                        [class.text-yellow-800]="campaign.statut === 'PLANIFIEE'"
                        [class.bg-green-100]="campaign.statut === 'EN_COURS'"
                        [class.text-green-800]="campaign.statut === 'EN_COURS'"
                        [class.bg-blue-100]="campaign.statut === 'TERMINEE'"
                        [class.text-blue-800]="campaign.statut === 'TERMINEE'"
                        [class.bg-red-100]="campaign.statut === 'ANNULEA'"
                        [class.text-red-800]="campaign.statut === 'ANNULEA'"
                      >
                        {{ getStatusLabel(campaign.statut) }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Info -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Affichage de {{ getFilteredCampaigns().length }} sur {{ campaigns().length }} campagnes
          </div>
        </div>
      }

      <!-- Distribution Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Status Distribution -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribution par statut</h3>
          <div class="space-y-3">
            @for (status of getStatusDistribution(); track status.name) {
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-gray-700 min-w-24">{{ status.name }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    [class.bg-yellow-500]="status.value === 'PLANIFIEE'"
                    [class.bg-green-500]="status.value === 'EN_COURS'"
                    [class.bg-blue-500]="status.value === 'TERMINEE'"
                    [class.bg-red-500]="status.value === 'ANNULEA'"
                    [style.width]="(status.count / getMaxStatusCount() * 100) + '%'"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-gray-900 min-w-8 text-right">{{ status.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Top Cities -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top villes (campagnes)</h3>
          <div class="space-y-3">
            @for (city of getTopCities(); track city.name) {
              <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <span class="text-sm font-medium text-gray-700 flex-1">{{ city.name }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ city.count }} campagnes</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminCampaignsComponent implements OnInit {
  campaigns = signal<CampagneResponse[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  selectedStatus = signal('');
  selectedType = signal('');
  selectedRegion = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.adminApi.getCampagnes().subscribe({
      next: (list) => {
        this.campaigns.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getFilteredCampaigns(): CampagneResponse[] {
    return this.campaigns().filter((campaign) => {
      const matchesSearch =
        this.searchTerm() === '' ||
        campaign.titre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        campaign.ville.toLowerCase().includes(this.searchTerm().toLowerCase());

      const matchesStatus =
        this.selectedStatus() === '' || campaign.statut === this.selectedStatus();

      const matchesType =
        this.selectedType() === '' ||
        (this.selectedType() === 'nationale' && campaign.nationale) ||
        (this.selectedType() === 'locale' && !campaign.nationale);

      const matchesRegion =
        this.selectedRegion() === '' || campaign.region === this.selectedRegion();

      return matchesSearch && matchesStatus && matchesType && matchesRegion;
    });
  }

  getActiveCampaignsCount(): number {
    return this.campaigns().filter((c) => c.statut === 'EN_COURS').length;
  }

  getTotalParticipants(): number {
    return this.campaigns().reduce((sum, c) => sum + c.nombreParticipants, 0);
  }

  getTotalCollected(): number {
    return this.campaigns().reduce((sum, c) => sum + c.quantiteCollectee, 0);
  }

  getRegions(): string[] {
    const regions = new Set(this.campaigns().map((c) => c.region));
    return Array.from(regions).sort();
  }

  getStatusLabel(statut: StatutCampagne): string {
    const map: { [key in StatutCampagne]: string } = {
      PLANIFIEE: 'Planifiée',
      EN_COURS: 'En cours',
      TERMINEE: 'Terminée',
      ANNULEA: 'Annulée',
    };
    return map[statut] || statut;
  }

  getStatusDistribution(): { name: string; value: StatutCampagne; count: number }[] {
    const distribution: { [key in StatutCampagne]: number } = {
      PLANIFIEE: 0,
      EN_COURS: 0,
      TERMINEE: 0,
      ANNULEA: 0,
    };

    this.campaigns().forEach((campaign) => {
      distribution[campaign.statut]++;
    });

    return Object.entries(distribution)
      .map(([value, count]) => ({
        name: this.getStatusLabel(value as StatutCampagne),
        value: value as StatutCampagne,
        count,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  getMaxStatusCount(): number {
    const distribution = this.getStatusDistribution();
    return Math.max(...distribution.map((d) => d.count), 1);
  }

  getTopCities(): { name: string; count: number }[] {
    const cities: { [key: string]: number } = {};
    this.campaigns().forEach((campaign) => {
      cities[campaign.ville] = (cities[campaign.ville] || 0) + 1;
    });
    return Object.entries(cities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
