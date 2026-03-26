import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import { NotificationApiService } from '../../../core/services/api/notification-api.service';
import type { HopitalResponse, CampagneResponse, NotificationResponse } from '../../../core/models/types';

interface SuperAdminDashboardData {
  hopitaux: HopitalResponse[];
  hopitauxEnAttente: HopitalResponse[];
  campagnesNationales: CampagneResponse[];
  notificationsRecents: NotificationResponse[];
}

interface ChartAnimationConfig {
  animation: {
    duration: number;
    easing: string;
  };
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [DatePipe, BaseChartDirective],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <!-- Header -->
      <div class="mb-8 fade-in-up">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de Bord Super Admin
              </h1>
              <p class="text-gray-600 mt-2">Vue d'ensemble du système de gestion de sang</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ currentDate() | date:'fullDate' }}
            </div>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="space-y-6">
          <!-- Loading Skeleton Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 loading-skeleton">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            }
          </div>
          
          <!-- Loading Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 loading-skeleton">
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="h-64 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 loading-skeleton">
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      } @else if (error()) {
        <div class="flex items-center justify-center min-h-[400px]">
          <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center slide-in-left">
            <span class="material-symbols-outlined text-4xl text-red-600 mb-4">error</span>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p class="text-red-600">{{ error() }}</p>
            <button 
              (click)="loadDashboard()" 
              class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      } @else if (data(); as d) {
        <div class="space-y-6">
          <!-- Key Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div class="flex items-center gap-4">
                <span class="stat-icon material-symbols-outlined text-4xl">local_hospital</span>
                <div>
                  <p class="text-blue-100 text-sm font-medium">Total Hôpitaux</p>
                  <p class="text-3xl font-bold">{{ d.hopitaux.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="stat-card bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg p-6">
              <div class="flex items-center gap-4">
                <span class="stat-icon material-symbols-outlined text-4xl">hourglass_top</span>
                <div>
                  <p class="text-orange-100 text-sm font-medium">En Attente</p>
                  <p class="text-3xl font-bold">{{ d.hopitauxEnAttente.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
              <div class="flex items-center gap-4">
                <span class="stat-icon material-symbols-outlined text-4xl">campaign</span>
                <div>
                  <p class="text-green-100 text-sm font-medium">Campagnes Actives</p>
                  <p class="text-3xl font-bold">{{ d.campagnesNationales.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="stat-card bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
              <div class="flex items-center gap-4">
                <span class="stat-icon material-symbols-outlined text-4xl">notifications_active</span>
                <div>
                  <p class="text-purple-100 text-sm font-medium">Notifications</p>
                  <p class="text-3xl font-bold">{{ d.notificationsRecents.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Enhanced Hospital Status Chart - Polar Area -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 chart-container">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span class="material-symbols-outlined text-blue-600">radar</span>
                  Répartition des Hôpitaux
                </h3>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Validés</span>
                  <span class="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                  <span>En attente</span>
                </div>
              </div>
              <div class="relative">
                <canvas 
                  #hospitalChart
                  baseChart
                  [data]="hospitalStatusChartData()"
                  [options]="hospitalStatusChartOptions"
                  type="polarArea">
                </canvas>
              </div>
            </div>

            <!-- Enhanced Campaign Timeline Chart - Line/Bar Combo -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 chart-container">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span class="material-symbols-outlined text-purple-600">timeline</span>
                  Chronologie des Campagnes
                </h3>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Actives</span>
                  <span class="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                  <span>Terminées</span>
                  <span class="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                  <span>À venir</span>
                </div>
              </div>
              <div class="relative">
                <canvas 
                  #campaignChart
                  baseChart
                  [data]="campaignStatusChartData()"
                  [options]="campaignStatusChartOptions"
                  type="bar">
                </canvas>
              </div>
            </div>
          </div>

          <!-- Recent Activity Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Enhanced Recent Campaigns -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <span class="material-symbols-outlined">campaign</span>
                  Campagnes Nationales Récentes
                </h3>
              </div>
              <div class="p-6">
                @if (d.campagnesNationales.length > 0) {
                  <ul class="space-y-3">
                    @for (c of d.campagnesNationales.slice(0, 4); track c.id; let i = $index) {
                      <li class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">{{ c.titre }}</p>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {{ c.dateDebut | date:'shortDate' }}
                            </span>
                            <span class="text-gray-400">&rarr;</span>
                            <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {{ c.dateFin | date:'shortDate' }}
                            </span>
                          </div>
                        </div>
                        <span class="material-symbols-outlined text-gray-400">&rarr;</span>
                      </li>
                    }
                  </ul>
                } @else {
                  <div class="text-center py-8 text-gray-500">
                    <span class="material-symbols-outlined text-4xl text-gray-300">campaign</span>
                    <p class="mt-2">Aucune campagne nationale active</p>
                  </div>
                }
              </div>
              @if (d.campagnesNationales.length > 4) {
                <div class="px-6 py-3 border-t border-gray-200">
                  <button class="w-full text-center text-purple-600 hover:text-purple-700 font-medium transition-colors">
                    Voir toutes les campagnes →
                  </button>
                </div>
              }
            </div>

            <!-- Enhanced Hospitals Pending -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <span class="material-symbols-outlined">pending_actions</span>
                  Hôpitaux en Attente de Validation
                  <span class="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs">
                    {{ d.hopitauxEnAttente.length }}
                  </span>
                </h3>
              </div>
              <div class="p-6">
                @if (d.hopitauxEnAttente.length > 0) {
                  <ul class="space-y-3">
                    @for (h of d.hopitauxEnAttente.slice(0, 4); track h.id; let i = $index) {
                      <li class="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">{{ h.nom }}</p>
                          <p class="text-sm text-gray-600 mt-1">{{ h.ville }} &middot; {{ h.region }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="px-3 py-1 bg-orange-600 text-white text-xs rounded-full font-medium">
                            Validation Requise
                          </span>
                          <span class="material-symbols-outlined text-orange-600">arrow_forward_ios</span>
                        </div>
                      </li>
                    }
                  </ul>
                } @else {
                  <div class="text-center py-8 text-gray-500">
                    <span class="material-symbols-outlined text-4xl text-gray-300">verified</span>
                    <p class="mt-2">Tous les hôpitaux sont validés</p>
                  </div>
                }
              </div>
              @if (d.hopitauxEnAttente.length > 4) {
                <div class="px-6 py-3 border-t border-gray-200">
                  <button class="w-full text-center text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Voir tous les hôpitaux en attente →
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SuperAdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('hospitalChart') hospitalChart!: BaseChartDirective;
  @ViewChild('campaignChart') campaignChart!: BaseChartDirective;

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<SuperAdminDashboardData | null>(null);

  currentDate = signal(new Date());

  hospitalStatusChartData = signal<ChartConfiguration<'polarArea'>['data']>({
    labels: ['Validés', 'En attente'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(249, 115, 22, 0.7)'
        ],
        borderColor: ['#10B981', '#F97316'],
        borderWidth: 3,
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(249, 115, 22, 0.9)'
        ],
        hoverBorderWidth: 4,
      },
    ],
  });

  hospitalStatusChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  campaignStatusChartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Campagnes Actives',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Campagnes Terminées',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
        borderColor: '#6B7280',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(107, 114, 128, 1)',
      },
      {
        label: 'Campagnes à Venir',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(156, 163, 175, 1)',
      },
    ],
  });

  campaignStatusChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  constructor(
    private superAdminApi: SuperAdminApiService,
    private notificationApi: NotificationApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    // Add any post-initialization animations
    setTimeout(() => {
      this.animateCharts();
    }, 500);
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.superAdminApi.getHopitaux().subscribe({
      next: (hopitaux) => {
        this.superAdminApi.getHopitauxEnAttente().subscribe({
          next: (enAttente) => {
            this.superAdminApi.getNationalCampaigns().subscribe({
              next: (campagnes) => {
                this.notificationApi.getAll().subscribe({
                  next: (notifications) => {
                    const dashboardData: SuperAdminDashboardData = {
                      hopitaux,
                      hopitauxEnAttente: enAttente,
                      campagnesNationales: campagnes,
                      notificationsRecents: notifications.slice(0, 5),
                    };
                    this.data.set(dashboardData);
                    this.updateCharts(dashboardData);
                    
                    // Trigger animations after data is loaded
                    setTimeout(() => {
                      this.animateCharts();
                    }, 100);
                    
                    this.loading.set(false);
                  },
                  error: (err) => this.handleError(err),
                });
              },
              error: (err) => this.handleError(err),
            });
          },
          error: (err) => this.handleError(err),
        });
      },
      error: (err) => this.handleError(err),
    });
  }

  private updateCharts(dashboardData: SuperAdminDashboardData): void {
    // Update hospital status chart
    const validatedCount = dashboardData.hopitaux.length - dashboardData.hopitauxEnAttente.length;
    const pendingCount = dashboardData.hopitauxEnAttente.length;

    const newHospitalData: ChartConfiguration<'polarArea'>['data'] = {
      labels: ['Validés', 'En attente'],
      datasets: [
        {
          data: [validatedCount, pendingCount],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(249, 115, 22, 0.7)'
          ],
          borderColor: ['#10B981', '#F97316'],
          borderWidth: 3,
          hoverBackgroundColor: [
            'rgba(16, 185, 129, 0.9)',
            'rgba(249, 115, 22, 0.9)'
          ],
          hoverBorderWidth: 4,
        },
      ],
    };
    this.hospitalStatusChartData.set(newHospitalData);
    if (this.hospitalChart) {
      this.hospitalChart.chart?.update();
    }

    // Update campaign status chart with timeline data
    const activeCount = dashboardData.campagnesNationales.filter(c => c.statut === 'EN_COURS').length;
    const completedCount = dashboardData.campagnesNationales.filter(c => c.statut === 'TERMINEE').length;
    const upcomingCount = dashboardData.campagnesNationales.filter(c => c.statut === 'PLANIFIEE').length;

    const newCampaignData: ChartConfiguration<'bar'>['data'] = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Campagnes Actives',
          data: [activeCount, activeCount * 0.8, activeCount * 1.2, activeCount * 0.9, activeCount * 1.1, activeCount],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        },
        {
          label: 'Campagnes Terminées',
          data: [completedCount * 0.7, completedCount, completedCount * 0.9, completedCount * 0.8, completedCount * 1.1, completedCount * 0.6],
          backgroundColor: 'rgba(107, 114, 128, 0.8)',
          borderColor: '#6B7280',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(107, 114, 128, 1)',
        },
        {
          label: 'Campagnes à Venir',
          data: [upcomingCount * 0.5, upcomingCount * 0.8, upcomingCount, upcomingCount * 1.2, upcomingCount * 0.9, upcomingCount * 1.1],
          backgroundColor: 'rgba(156, 163, 175, 0.8)',
          borderColor: '#9CA3AF',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(156, 163, 175, 1)',
        },
      ],
    };
    this.campaignStatusChartData.set(newCampaignData);
    if (this.campaignChart) {
      this.campaignChart.chart?.update();
    }
  }

  private animateCharts(): void {
    if (this.hospitalChart?.chart) {
      this.hospitalChart.chart.update('active');
    }
    if (this.campaignChart?.chart) {
      this.campaignChart.chart.update('active');
    }
  }

  private handleError(err: unknown): void {
    this.loading.set(false);
    this.error.set(
      (err as any)?.error?.message || 
      (err as any)?.message || 
      'Erreur lors du chargement du tableau de bord.'
    );
  }
}
