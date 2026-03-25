import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import type { StatistiquesGlobales } from '../../../core/models/types';

@Component({
  selector: 'app-global-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Statistiques globales du système</h2>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <p class="text-gray-500">Chargement des statistiques...</p>
        </div>
      } @else if (error()) {
        <div class="p-4 rounded-lg bg-red-50 text-red-700">
          {{ error() }}
        </div>
      } @else if (stats(); as s) {
        <!-- Main metrics grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Hospitals -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">Total Hôpitaux</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">{{ s.totalHopitaux }}</p>
              </div>
              <span class="material-symbols-outlined text-4xl text-blue-300">local_hospital</span>
            </div>
            <div class="mt-3 pt-3 border-t border-blue-200">
              <p class="text-xs text-blue-700">✓ {{ s.hopitauxActifs }} actifs</p>
            </div>
          </div>

          <!-- Total Donors -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-600 font-medium">Total Donneurs</p>
                <p class="text-3xl font-bold text-red-900 mt-2">{{ s.totalDonneurs }}</p>
              </div>
              <span class="material-symbols-outlined text-4xl text-red-300">volunteer_activism</span>
            </div>
            <div class="mt-3 pt-3 border-t border-red-200">
              <p class="text-xs text-red-700">👥 Contributeurs actifs</p>
            </div>
          </div>

          <!-- Total Donations -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 font-medium">Total Dons</p>
                <p class="text-3xl font-bold text-green-900 mt-2">{{ s.totalDons }}</p>
              </div>
              <span class="material-symbols-outlined text-4xl text-green-300">bloodtype</span>
            </div>
            <div class="mt-3 pt-3 border-t border-green-200">
              <p class="text-xs text-green-700">🩸 Collectés au total</p>
            </div>
          </div>

          <!-- Total Requests -->
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-orange-600 font-medium">Total Demandes</p>
                <p class="text-3xl font-bold text-orange-900 mt-2">{{ s.totalDemandes }}</p>
              </div>
              <span class="material-symbols-outlined text-4xl text-orange-300">assignment</span>
            </div>
            <div class="mt-3 pt-3 border-t border-orange-200">
              <p class="text-xs text-orange-700">📋 Demandes de sang</p>
            </div>
          </div>
        </div>

        <!-- Secondary metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Active Users -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Utilisateurs</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span class="text-sm text-gray-600">Admin(s)</span>
                <span class="font-bold text-lg text-purple-600">{{ s.totalAdmins }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span class="text-sm text-gray-600">Utilisateurs</span>
                <span class="font-bold text-lg text-indigo-600">{{ s.totalUtilisateurs }}</span>
              </div>
            </div>
          </div>

          <!-- Campaigns -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Campagnes</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span class="text-sm text-gray-600">Campagnes actives</span>
                <span class="font-bold text-lg text-yellow-600">{{ s.campagnesActives }}</span>
              </div>
              <div class="text-xs text-gray-500 p-3">
                📢 Campagnes de collecte de sang
              </div>
            </div>
          </div>

          <!-- Hospital Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">État Hôpitaux</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span class="text-sm text-gray-600">Validés</span>
                <span class="font-bold text-lg text-green-600">{{ s.hopitauxActifs }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span class="text-sm text-gray-600">En attente</span>
                <span class="font-bold text-lg text-orange-600">{{ s.totalHopitaux - s.hopitauxActifs }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Geographic Distribution -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribution par région</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              @if (getRegions().length > 0) {
                @for (region of getRegions(); track region.name) {
                  <div class="flex items-center gap-3 p-2">
                    <span class="text-sm font-medium text-gray-700 min-w-24">{{ region.name }}</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full transition-all"
                        [style.width]="(region.value / getMaxRegionValue() * 100) + '%'"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 min-w-8 text-right">{{ region.value }}</span>
                  </div>
                }
              } @else {
                <p class="text-gray-500 text-sm">Pas de données disponibles</p>
              }
            </div>
          </div>

          <!-- City Distribution -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top villes (Donneurs)</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              @if (getCities().length > 0) {
                @for (city of getCities().slice(0, 10); track city.name) {
                  <div class="flex items-center gap-3 p-2">
                    <span class="text-sm font-medium text-gray-700 min-w-32">{{ city.name }}</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-red-500 h-2 rounded-full transition-all"
                        [style.width]="(city.value / getMaxCityValue() * 100) + '%'"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 min-w-8 text-right">{{ city.value }}</span>
                  </div>
                }
              } @else {
                <p class="text-gray-500 text-sm">Pas de données disponibles</p>
              }
            </div>
          </div>
        </div>

        <!-- Timeline Data -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Monthly Donations -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Dons par mois</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              @if (getMonths().length > 0) {
                @for (month of getMonths(); track month.name) {
                  <div class="flex items-center gap-3 p-2">
                    <span class="text-sm font-medium text-gray-700 min-w-20">{{ month.name }}</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all"
                        [style.width]="(month.value / getMaxMonthValue() * 100) + '%'"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 min-w-8 text-right">{{ month.value }}</span>
                  </div>
                }
              } @else {
                <p class="text-gray-500 text-sm">Pas de données disponibles</p>
              }
            </div>
          </div>

          <!-- Satisfaction Rate -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualité du service</h3>
            <div class="space-y-6">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Taux de satisfaction global</span>
                  <span class="text-2xl font-bold text-gray-900">{{ Math.min(s.tauxSatisfactionGlobal * 100, 100).toFixed(0) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div
                    class="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
                    [style.width]="Math.min(s.tauxSatisfactionGlobal * 100, 100) + '%'"
                  ></div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <p class="text-xs text-gray-600 mb-1">Hôpitaux validés</p>
                  <p class="text-2xl font-bold text-green-600">{{ ((s.hopitauxActifs / s.totalHopitaux) * 100).toFixed(0) }}%</p>
                </div>
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <p class="text-xs text-gray-600 mb-1">Demandes satisfaites</p>
                  <p class="text-2xl font-bold text-blue-600">~{{ Math.round(s.totalDons / Math.max(s.totalDemandes, 1) * 100) }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class GlobalStatsComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<StatistiquesGlobales | null>(null);
  Math = Math;

  constructor(private superAdminApi: SuperAdminApiService) {}

  ngOnInit(): void {
    this.superAdminApi.getStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? err?.message ?? 'Erreur lors du chargement des statistiques.'
        );
      },
    });
  }

  getRegions(): { name: string; value: number }[] {
    const s = this.stats();
    if (!s?.hopitauxParRegion) return [];
    return Object.entries(s.hopitauxParRegion)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }

  getCities(): { name: string; value: number }[] {
    const s = this.stats();
    if (!s?.donneursParVille) return [];
    return Object.entries(s.donneursParVille)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }

  getMonths(): { name: string; value: number }[] {
    const s = this.stats();
    if (!s?.donsParMois) return [];
    return Object.entries(s.donsParMois)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }

  getMaxRegionValue(): number {
    const regions = this.getRegions();
    return Math.max(...regions.map(r => r.value), 1);
  }

  getMaxCityValue(): number {
    const cities = this.getCities();
    return Math.max(...cities.map(c => c.value), 1);
  }

  getMaxMonthValue(): number {
    const months = this.getMonths();
    return Math.max(...months.map(m => m.value), 1);
  }
}
