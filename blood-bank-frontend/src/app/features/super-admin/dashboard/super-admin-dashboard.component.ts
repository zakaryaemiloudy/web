import { Component, OnInit, signal, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [DatePipe, BaseChartDirective],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Tableau de bord Super Admin</h2>

      @if (loading()) {
        <p class="text-gray-500">Chargement du tableau de bord...</p>
      } @else if (error()) {
        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ error() }}
        </div>
      } @else if (data(); as d) {
        <!-- Stat cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-red-600">local_hospital</span>
              <div>
                <p class="text-sm text-gray-500">Hôpitaux</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.hopitaux.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-orange-600">hourglass_top</span>
              <div>
                <p class="text-sm text-gray-500">En attente</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.hopitauxEnAttente.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-blue-600">campaign</span>
              <div>
                <p class="text-sm text-gray-500">Campagnes nationales</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.campagnesNationales.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-emerald-600">notifications</span>
              <div>
                <p class="text-sm text-gray-500">Notifications récentes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.notificationsRecents.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Hospital Status Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-medium text-gray-700 mb-4">État des hôpitaux</h3>
            <canvas #hospitalChart
              baseChart
              [data]="hospitalStatusChartData()"
              [options]="hospitalStatusChartOptions"
              type="doughnut">
            </canvas>
          </div>

          <!-- Campaigns Status Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-medium text-gray-700 mb-4">Statuts des campagnes</h3>
            <canvas #campaignChart
              baseChart
              [data]="campaignStatusChartData()"
              [options]="campaignStatusChartOptions"
              type="doughnut">
            </canvas>
          </div>
        </div>

        <!-- Recent items row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent national campaigns -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Campagnes nationales récentes</h3>
            </div>
            <ul class="divide-y divide-gray-200">
              @for (c of d.campagnesNationales.slice(0, 5); track c.id) {
                <li class="px-6 py-3 hover:bg-gray-50">
                  <p class="text-sm font-medium text-gray-900">{{ c.titre }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ c.dateDebut | date:'shortDate' }} – {{ c.dateFin | date:'shortDate' }}
                  </p>
                </li>
              } @empty {
                <li class="px-6 py-4 text-sm text-gray-500">Aucune campagne nationale.</li>
              }
            </ul>
          </div>

          <!-- Hospitals pending validation -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Hôpitaux en attente</h3>
            </div>
            <ul class="divide-y divide-gray-200">
              @for (h of d.hopitauxEnAttente.slice(0, 5); track h.id) {
                <li class="px-6 py-3 hover:bg-gray-50">
                  <p class="text-sm font-medium text-gray-900">{{ h.nom }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ h.ville }} · {{ h.region }}</p>
                </li>
              } @empty {
                <li class="px-6 py-4 text-sm text-gray-500">Aucun hôpital en attente.</li>
              }
            </ul>
          </div>
        </div>
      }
    </div>
  `,
})
export class SuperAdminDashboardComponent implements OnInit {
  @ViewChild('hospitalChart') hospitalChart!: BaseChartDirective;
  @ViewChild('campaignChart') campaignChart!: BaseChartDirective;

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<SuperAdminDashboardData | null>(null);

  hospitalStatusChartData = signal<ChartConfiguration<'doughnut'>['data']>({
    labels: ['Validés', 'En attente'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#10B981', '#F97316'],
        borderColor: ['#059669', '#EA580C'],
        borderWidth: 2,
      },
    ],
  });

  hospitalStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  campaignStatusChartData = signal<ChartConfiguration<'doughnut'>['data']>({
    labels: ['Actives', 'Terminées', 'À venir'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#3B82F6', '#6B7280', '#9CA3AF'],
        borderColor: ['#1E40AF', '#4B5563', '#6B7280'],
        borderWidth: 2,
      },
    ],
  });

  campaignStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(
    private superAdminApi: SuperAdminApiService,
    private notificationApi: NotificationApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
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

    const newHospitalData: ChartConfiguration<'doughnut'>['data'] = {
      labels: ['Validés', 'En attente'],
      datasets: [
        {
          data: [validatedCount, pendingCount],
          backgroundColor: ['#10B981', '#F97316'],
          borderColor: ['#059669', '#EA580C'],
          borderWidth: 2,
        },
      ],
    };
    this.hospitalStatusChartData.set(newHospitalData);
    if (this.hospitalChart) {
      this.hospitalChart.chart?.update();
    }

    // Update campaign status chart
    const now = new Date();
    const activeCampaigns = dashboardData.campagnesNationales.filter(
      c => new Date(c.dateDebut) <= now && new Date(c.dateFin) >= now
    ).length;
    const completedCampaigns = dashboardData.campagnesNationales.filter(
      c => new Date(c.dateFin) < now
    ).length;
    const upcomingCampaigns = dashboardData.campagnesNationales.filter(
      c => new Date(c.dateDebut) > now
    ).length;

    const newCampaignData: ChartConfiguration<'doughnut'>['data'] = {
      labels: ['Actives', 'Terminées', 'À venir'],
      datasets: [
        {
          data: [activeCampaigns, completedCampaigns, upcomingCampaigns],
          backgroundColor: ['#3B82F6', '#6B7280', '#9CA3AF'],
          borderColor: ['#1E40AF', '#4B5563', '#6B7280'],
          borderWidth: 2,
        },
      ],
    };
    this.campaignStatusChartData.set(newCampaignData);
    if (this.campaignChart) {
      this.campaignChart.chart?.update();
    }
  }

  private handleError(err: unknown): void {
    this.loading.set(false);
    this.error.set(
      (err as any)?.error?.message ??
        (err as any)?.message ??
        'Erreur lors du chargement du tableau de bord.'
    );
  }
}
