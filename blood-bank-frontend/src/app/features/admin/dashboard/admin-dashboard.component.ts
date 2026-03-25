import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { DashboardAnalytics, DonResponse, DemandeSangResponse, GroupeSanguin } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { bloodGroupLabel } from '../../../shared/utils/blood-type';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent, BloodTypeBadgeComponent, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('barChart') barChart!: BaseChartDirective;
  @ViewChild('doughnutChart') doughnutChart!: BaseChartDirective;

  analytics = signal<DashboardAnalytics | null>(null);
  recentDons = signal<DonResponse[]>([]);
  demandesUrgentes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);

  // Chart data as signals for reactivity
  donsParGroupeChartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [{
      label: 'Dons par groupe sanguin',
      data: [],
      backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'],
      borderRadius: 4,
      borderSkipped: false,
    }],
  });

  donsParGroupeChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  stockLevelsChartData = signal<ChartConfiguration<'doughnut'>['data']>({
    labels: ['Critique', 'Alerte', 'Normal', 'Optimal'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#10B981'],
      borderColor: ['#DC2626', '#EA580C', '#F59E0B', '#059669'],
      borderWidth: 2,
    }],
  });

  stockLevelsChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getDashboard().subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.updateCharts(data);
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
    this.adminApi.getDons().subscribe({
      next: (list) => this.recentDons.set(list.slice(0, 5)),
      error: () => {},
    });
    this.adminApi.getDemandesUrgentes().subscribe({
      next: (list) => this.demandesUrgentes.set(list),
      error: () => {},
    });
  }

  private updateCharts(data: DashboardAnalytics): void {
    // Update donations by blood group chart
    const groups = Object.keys(data.donsParGroupe || {}) as GroupeSanguin[];
    const values = groups.map(g => data.donsParGroupe![g] || 0);

    const newBarData: ChartConfiguration<'bar'>['data'] = {
      labels: groups.map(g => bloodGroupLabel(g)),
      datasets: [{
        label: 'Dons par groupe sanguin',
        data: values,
        backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'],
        borderRadius: 4,
        borderSkipped: false,
      }],
    };
    this.donsParGroupeChartData.set(newBarData);

    // Update stock levels chart
    const stocksList = data.stocksCritiques || [];
    const critiques = stocksList.filter(s => s.niveauStock === 'CRITIQUE').length;
    const alertes = stocksList.filter(s => s.niveauStock === 'ALERTE').length;
    const normaux = stocksList.filter(s => s.niveauStock === 'NORMAL').length;
    const optimaux = stocksList.filter(s => s.niveauStock === 'OPTIMAL').length;

    const newDoughnutData: ChartConfiguration<'doughnut'>['data'] = {
      labels: ['Critique', 'Alerte', 'Normal', 'Optimal'],
      datasets: [{
        data: [critiques, alertes, normaux, optimaux],
        backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#10B981'],
        borderColor: ['#DC2626', '#EA580C', '#F59E0B', '#059669'],
        borderWidth: 2,
      }],
    };
    this.stockLevelsChartData.set(newDoughnutData);

    // Refresh charts
    if (this.barChart) {
      this.barChart.chart?.update();
    }
    if (this.doughnutChart) {
      this.doughnutChart.chart?.update();
    }
  }

  bloodLabel = bloodGroupLabel;

  urgencyBorderClass(urgence: string): string {
    if (urgence === 'CRITIQUE') return 'border-l-red-500';
    if (urgence === 'HAUTE') return 'border-l-orange-500';
    return 'border-l-sky-500';
  }

  getStocksCritiquesCount(): number {
    return this.analytics()?.stats.stocksCritiques ?? 0;
  }
}

