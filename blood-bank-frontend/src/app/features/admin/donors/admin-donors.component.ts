import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import type { DonneurResponse } from '../../../core/models/types';

@Component({
  selector: 'app-admin-donors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Gestion des donneurs</h2>
        <div class="flex gap-2">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {{ donors().length }} donneurs
          </span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Donors -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-600 font-medium">Total Donneurs</p>
              <p class="text-3xl font-bold text-red-900 mt-1">{{ donors().length }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-red-300">volunteer_activism</span>
          </div>
        </div>

        <!-- Eligible Donors -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Éligibles</p>
              <p class="text-3xl font-bold text-green-900 mt-1">{{ getEligibleCount() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-green-300">check_circle</span>
          </div>
        </div>

        <!-- Top Blood Type -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Groupe dominant</p>
              <p class="text-3xl font-bold text-blue-900 mt-1">{{ getTopBloodType() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-blue-300">bloodtype</span>
          </div>
        </div>

        <!-- Total Points -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-600 font-medium">Points totaux</p>
              <p class="text-3xl font-bold text-purple-900 mt-1">{{ getTotalPoints() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-purple-300">star</span>
          </div>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Nom, email ou ville..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Groupe sanguin</label>
            <select
              [(ngModel)]="selectedBloodType"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tous les groupes</option>
              <option value="O_POSITIF">O+</option>
              <option value="O_NEGATIF">O-</option>
              <option value="A_POSITIF">A+</option>
              <option value="A_NEGATIF">A-</option>
              <option value="B_POSITIF">B+</option>
              <option value="B_NEGATIF">B-</option>
              <option value="AB_POSITIF">AB+</option>
              <option value="AB_NEGATIF">AB-</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              [(ngModel)]="selectedStatus"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="eligible">Éligible</option>
              <option value="ineligible">Non éligible</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Donors List -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <p class="text-gray-500">Chargement des donneurs...</p>
        </div>
      } @else if (getFilteredDonors().length === 0) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-300 block mb-2">person_off</span>
          <p class="text-gray-500">Aucun donneur trouvé</p>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dons</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernier don</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (donor of getFilteredDonors(); track donor.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span class="text-sm font-semibold text-red-600">
                            {{ donor.prenom.charAt(0) }}{{ donor.nom.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ donor.prenom }} {{ donor.nom }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ donor.email }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {{ formatBloodType(donor.groupeSanguin) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ donor.ville || '-' }}</td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-gray-900">{{ donor.nombreDonsTotal }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-purple-600">{{ donor.pointsTotal }} pts</span>
                    </td>
                    <td class="px-6 py-4">
                      @if (donor.eligible) {
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Éligible
                        </span>
                      } @else {
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ✗ Non éligible
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ donor.dateDernierDon ? (donor.dateDernierDon | date:'short') : 'Jamais' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Info -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Affichage de {{ getFilteredDonors().length }} sur {{ donors().length }} donneurs
          </div>
        </div>
      }

      <!-- Blood Type Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Blood Types Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribution des groupes sanguins</h3>
          <div class="space-y-3">
            @for (type of getBloodTypeDistribution(); track type.name) {
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-gray-700 min-w-12">{{ type.name }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-red-500 h-2 rounded-full transition-all"
                    [style.width]="(type.count / getMaxBloodTypeCount() * 100) + '%'"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-gray-900 min-w-8 text-right">{{ type.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Top Cities -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top villes (donneurs)</h3>
          <div class="space-y-3">
            @for (city of getTopCities(); track city.name) {
              <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <span class="text-sm font-medium text-gray-700 flex-1">{{ city.name }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ city.count }} donneurs</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDonorsComponent implements OnInit {
  donors = signal<DonneurResponse[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  selectedBloodType = signal('');
  selectedStatus = signal('');

  constructor(private donorApi: DonorApiService) {}

  ngOnInit(): void {
    this.loadDonors();
  }

  private loadDonors(): void {
    this.donorApi.getClassement().subscribe({
      next: (list) => {
        this.donors.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getFilteredDonors(): DonneurResponse[] {
    return this.donors().filter((donor) => {
      const matchesSearch =
        this.searchTerm() === '' ||
        donor.prenom.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        donor.nom.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        donor.email.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        (donor.ville?.toLowerCase() ?? '').includes(this.searchTerm().toLowerCase());

      const matchesBloodType =
        this.selectedBloodType() === '' || donor.groupeSanguin === this.selectedBloodType();

      const matchesStatus =
        this.selectedStatus() === '' ||
        (this.selectedStatus() === 'eligible' && donor.eligible) ||
        (this.selectedStatus() === 'ineligible' && !donor.eligible);

      return matchesSearch && matchesBloodType && matchesStatus;
    });
  }

  getEligibleCount(): number {
    return this.donors().filter((d) => d.eligible).length;
  }

  getTotalPoints(): number {
    return this.donors().reduce((sum, d) => sum + d.pointsTotal, 0);
  }

  getTopBloodType(): string {
    const distribution = this.getBloodTypeDistribution();
    if (distribution.length === 0) return '-';
    const top = distribution.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );
    return top.name;
  }

  getBloodTypeDistribution(): { name: string; count: number }[] {
    const bloodTypes: { [key: string]: number } = {};
    this.donors().forEach((donor) => {
      bloodTypes[donor.groupeSanguin] = (bloodTypes[donor.groupeSanguin] || 0) + 1;
    });
    return Object.entries(bloodTypes)
      .map(([name, count]) => ({ name: this.formatBloodType(name as any), count }))
      .sort((a, b) => b.count - a.count);
  }

  getMaxBloodTypeCount(): number {
    const distribution = this.getBloodTypeDistribution();
    return Math.max(...distribution.map((d) => d.count), 1);
  }

  getTopCities(): { name: string; count: number }[] {
    const cities: { [key: string]: number } = {};
    this.donors().forEach((donor) => {
      if (donor.ville) {
        cities[donor.ville] = (cities[donor.ville] || 0) + 1;
      }
    });
    return Object.entries(cities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  formatBloodType(type: string): string {
    const map: { [key: string]: string } = {
      O_POSITIF: 'O+',
      O_NEGATIF: 'O-',
      A_POSITIF: 'A+',
      A_NEGATIF: 'A-',
      B_POSITIF: 'B+',
      B_NEGATIF: 'B-',
      AB_POSITIF: 'AB+',
      AB_NEGATIF: 'AB-',
    };
    return map[type] || type;
  }
}
