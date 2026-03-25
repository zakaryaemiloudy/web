import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import type { BadgeResponse, DonneurResponse, NiveauBadge } from '../../../core/models/types';

interface BadgeInfo {
  level: NiveauBadge;
  label: string;
  description: string;
  icon: string;
  color: string;
  minPoints: number;
  maxPoints: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Leaderboard</h2>
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-2 border-b border-gray-200">
        <button
          (click)="activeTab.set('badges')"
          [class.border-b-2]="activeTab() === 'badges'"
          [class.border-red-600]="activeTab() === 'badges'"
          [class.text-red-600]="activeTab() === 'badges'"
          class="px-4 py-2 font-medium transition-colors"
        >
          Badges
        </button>
        <button
          (click)="activeTab.set('leaderboard')"
          [class.border-b-2]="activeTab() === 'leaderboard'"
          [class.border-red-600]="activeTab() === 'leaderboard'"
          [class.text-red-600]="activeTab() === 'leaderboard'"
          class="px-4 py-2 font-medium transition-colors"
        >
          Classement
        </button>
      </div>

      @if (loading()) {
        <p class="text-gray-500">Chargement...</p>
      } @else if (activeTab() === 'badges') {
        <!-- BADGES TAB -->
        @if (donor(); as d) {
          <!-- Current stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-red-600 font-medium">Vos points</p>
                  <p class="text-3xl font-bold text-red-700 mt-1">{{ d.pointsTotal }}</p>
                </div>
                <span class="material-symbols-outlined text-4xl text-red-300">star</span>
              </div>
              <p class="text-xs text-red-600 mt-4">Niveau: {{ getCurrentBadgeLabel(d.pointsTotal) }}</p>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600 font-medium">Dons totaux</p>
                  <p class="text-3xl font-bold text-blue-700 mt-1">{{ d.nombreDonsTotal }}</p>
                </div>
                <span class="material-symbols-outlined text-4xl text-blue-300">volunteer_activism</span>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-600 font-medium">Prochains points</p>
                  <p class="text-3xl font-bold text-green-700 mt-1">{{ getPointsUntilNextLevel(d.pointsTotal) }}</p>
                </div>
                <span class="material-symbols-outlined text-4xl text-green-300">trending_up</span>
              </div>
            </div>
          </div>

          <!-- Badge levels -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Système de badges</h3>
            <p class="text-sm text-gray-600 mb-6">Collectez des points avec chaque don et débloquez de nouveaux badges!</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (badge of badgeLevels; track badge.level) {
                <div
                  class="relative group cursor-pointer"
                  [class.opacity-50]="d.pointsTotal < badge.minPoints"
                >
                  <div
                    class="rounded-lg p-4 text-center transition-all group-hover:shadow-md"
                    [style.backgroundColor]="getLevelColor(badge.level) + '15'"
                    [style.borderColor]="getLevelColor(badge.level)"
                    style="border: 2px solid"
                  >
                    <div
                      class="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl"
                      [style.backgroundColor]="getLevelColor(badge.level)"
                      [style.color]="'white'"
                    >
                      {{ getBadgeIcon(badge.level) }}
                    </div>
                    <p class="font-semibold text-sm text-gray-900">{{ badge.label }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ badge.minPoints }} pts</p>
                  </div>

                  <!-- Hover tooltip -->
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                  >
                    {{ badge.description }}
                    <div
                      class="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2"
                      [style.backgroundColor]="'#111827'"
                    ></div>
                  </div>

                  <!-- Active indicator -->
                  @if (d.pointsTotal >= badge.minPoints && d.pointsTotal < badge.maxPoints) {
                    <div class="absolute top-1 right-1">
                      <span class="material-symbols-outlined text-lg text-green-500">check_circle</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Earned badges -->
          @if (userBadges().length > 0) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Badges obtenus</h3>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                @for (badge of userBadges(); track badge.id) {
                  <div class="text-center">
                    <div
                      class="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl"
                      [style.backgroundColor]="getLevelColor(badge.niveau) + '30'"
                    >
                      {{ getBadgeIcon(badge.niveau) }}
                    </div>
                    <p class="text-xs font-medium text-gray-900">{{ getBadgeLabel(badge.niveau) }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Progress bar -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Progression vers le niveau suivant</h3>
            <div class="flex items-center gap-3">
              @for (level of badgeLevels; track level.level) {
                @if (d.pointsTotal >= level.minPoints && d.pointsTotal < level.maxPoints) {
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-medium text-gray-700">{{ level.label }}</span>
                      <span class="text-sm text-gray-600">{{ d.pointsTotal - level.minPoints }} / {{ level.maxPoints - level.minPoints }} pts</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full transition-all"
                        [style.width]="getProgressPercent(d.pointsTotal, level.minPoints, level.maxPoints) + '%'"
                        [style.backgroundColor]="getLevelColor(level.level)"
                      ></div>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        }
      } @else if (activeTab() === 'leaderboard') {
        <!-- LEADERBOARD TAB -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Classement des donateurs</h3>
          <p class="text-sm text-gray-600 mb-6">Les donateurs les plus généreux et actifs du système</p>
          
          @if (leaderboardLoading()) {
            <p class="text-gray-500">Chargement du classement...</p>
          } @else if (leaderboard().length > 0) {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Rang</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Donateur</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Points</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Dons</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-900">Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  @for (donor of leaderboard(); track donor.id; let i = $index) {
                    <tr class="border-b border-gray-100 hover:bg-gray-50" [class.bg-red-50]="isCurrentUser(donor)">
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full" [ngClass]="getRankClass(i)">
                          {{ i + 1 }}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="font-medium text-gray-900">{{ donor.prenom }} {{ donor.nom }}</div>
                        <div class="text-xs text-gray-500">{{ donor.email }}</div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="text-lg font-semibold text-gray-900">{{ donor.pointsTotal }}</div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="text-gray-700">{{ donor.nombreDonsTotal }}</div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" [style.backgroundColor]="getLevelColor(getCurrentBadgeLevel(donor.pointsTotal)) + '20'" [style.color]="getLevelColor(getCurrentBadgeLevel(donor.pointsTotal))">
                          {{ getBadgeIcon(getCurrentBadgeLevel(donor.pointsTotal)) }}
                          {{ getCurrentBadgeLabel(donor.pointsTotal) }}
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="text-gray-500">Aucun donateur dans le classement</p>
          }
        </div>
      }
    </div>
  `,
})
export class LeaderboardComponent implements OnInit {
  activeTab = signal<'badges' | 'leaderboard'>('badges');
  donor = signal<DonneurResponse | null>(null);
  userBadges = signal<BadgeResponse[]>([]);
  leaderboard = signal<DonneurResponse[]>([]);
  loading = signal(true);
  leaderboardLoading = signal(false);
  currentUserId: number | null = null;

  badgeLevels: BadgeInfo[] = [
    {
      level: 'BRONZE',
      label: 'Bronze',
      description: 'Première récompense',
      icon: '🥉',
      color: '#CD7F32',
      minPoints: 0,
      maxPoints: 500,
    },
    {
      level: 'ARGENT',
      label: 'Argent',
      description: 'Donneurs réguliers',
      icon: '🥈',
      color: '#C0C0C0',
      minPoints: 500,
      maxPoints: 1000,
    },
    {
      level: 'OR',
      label: 'Or',
      description: 'Contributeur généreux',
      icon: '🥇',
      color: '#FFD700',
      minPoints: 1000,
      maxPoints: 1500,
    },
    {
      level: 'PLATINE',
      label: 'Platine',
      description: 'Héros local!',
      icon: '💎',
      color: '#E5E4E2',
      minPoints: 1500,
      maxPoints: 2500,
    },
    {
      level: 'DIAMANT',
      label: 'Diamant',
      description: 'Sauveur de vies!',
      icon: '⭐',
      color: '#3B82F6',
      minPoints: 2500,
      maxPoints: 3500,
    },
    {
      level: 'HERO',
      label: 'Héros',
      description: 'Exemplaire de générosité',
      icon: '👑',
      color: '#EF4444',
      minPoints: 3500,
      maxPoints: 5000,
    },
    {
      level: 'LEGENDE',
      label: 'Légende',
      description: 'Le don permanent',
      icon: '🌟',
      color: '#F59E0B',
      minPoints: 5000,
      maxPoints: 7500,
    },
    {
      level: 'CHAMPION',
      label: 'Champion',
      description: 'Ultime reconnaissance',
      icon: '🏆',
      color: '#06B6D4',
      minPoints: 7500,
      maxPoints: Infinity,
    },
  ];

  constructor(private donorApi: DonorApiService) {}

  ngOnInit(): void {
    this.donorApi.getProfile().subscribe({
      next: (profile) => {
        this.donor.set(profile);
        this.currentUserId = profile.id;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.donorApi.getUserBadges().subscribe({
      next: (badges) => this.userBadges.set(badges),
      error: () => {},
    });

    // Load leaderboard when component initializes
    this.loadLeaderboard();
  }

  private loadLeaderboard(): void {
    this.leaderboardLoading.set(true);
    this.donorApi.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard.set(data);
        this.leaderboardLoading.set(false);
      },
      error: () => this.leaderboardLoading.set(false),
    });
  }

  getCurrentBadgeLabel(points: number): string {
    for (const badge of this.badgeLevels) {
      if (points >= badge.minPoints && points < badge.maxPoints) {
        return badge.label;
      }
    }
    return 'Champion';
  }

  getCurrentBadgeLevel(points: number): NiveauBadge {
    for (const badge of this.badgeLevels) {
      if (points >= badge.minPoints && points < badge.maxPoints) {
        return badge.level;
      }
    }
    return 'CHAMPION';
  }

  getBadgeLabel(level: NiveauBadge): string {
    return this.badgeLevels.find(b => b.level === level)?.label || level;
  }

  getBadgeIcon(level: NiveauBadge): string {
    return this.badgeLevels.find(b => b.level === level)?.icon || '⭐';
  }

  getLevelColor(level: NiveauBadge): string {
    return this.badgeLevels.find(b => b.level === level)?.color || '#6B7280';
  }

  getPointsUntilNextLevel(points: number): number {
    for (const badge of this.badgeLevels) {
      if (points >= badge.minPoints && points < badge.maxPoints) {
        return badge.maxPoints - points;
      }
    }
    return 0;
  }

  getProgressPercent(current: number, min: number, max: number): number {
    if (max === Infinity) return 100;
    return Math.min(((current - min) / (max - min)) * 100, 100);
  }

  getRankClass(index: number): string {
    if (index === 0) return 'bg-yellow-100 text-yellow-900 font-bold';
    if (index === 1) return 'bg-gray-100 text-gray-900 font-bold';
    if (index === 2) return 'bg-orange-100 text-orange-900 font-bold';
    return 'bg-gray-50 text-gray-900';
  }

  isCurrentUser(donor: DonneurResponse): boolean {
    return donor.id === this.currentUserId;
  }
}
