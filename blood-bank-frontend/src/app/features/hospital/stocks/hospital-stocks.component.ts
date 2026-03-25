import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { StockResponse } from '../../../core/models/types';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';

@Component({
  selector: 'app-hospital-stocks',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule, BloodTypeBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestion des stocks de sang</h1>
            <p class="text-gray-600 mt-1">Consultez et gérez les stocks de sang de votre hôpital</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-500">
              Total: <span class="font-semibold text-gray-900">{{ stocks().length }}</span> types
            </div>
            <div class="text-sm text-green-600">
              Stock total: <span class="font-semibold">{{ totalStock() }} ml</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Chargement des stocks...</p>
        </div>
      } @else if (stocks().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <span class="material-symbols-outlined text-4xl text-gray-400">inventory_2</span>
          <p class="text-gray-600 mt-4">Aucun stock disponible</p>
        </div>
      } @else {
        <!-- Stocks Grid -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe sanguin</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière mise à jour</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (stock of stocks(); track stock.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-blood-type-badge [groupeSanguin]="stock.groupeSanguin" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ stock.quantiteDisponible }} ml
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ stock.derniereMiseAJour | date:'dd/MM/yyyy HH:mm' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 rounded text-xs font-medium"
                        [class]="getStockStatusClass(stock.quantiteDisponible)"
                      >
                        {{ getStockStatusLabel(stock.quantiteDisponible) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center gap-2">
                        <button
                          (click)="editStock(stock)"
                          class="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Modifier le stock"
                        >
                          <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          (click)="refreshStock(stock.id)"
                          class="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Actualiser"
                        >
                          <span class="material-symbols-outlined text-sm">refresh</span>
                        </button>
                      </div>
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
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class HospitalStocksComponent implements OnInit {
  stocks = signal<StockResponse[]>([]);
  loading = signal(true);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  private loadStocks(): void {
    this.loading.set(true);
    // Using admin API to get stocks - in real app, filter by hospital ID
    this.adminApi.getStocks().subscribe({
      next: (stocks: StockResponse[]) => {
        // For now, show all stocks - in real app, filter by hospital ID
        // TODO: Filter by hospital ID when hospital auth is implemented
        this.stocks.set(stocks);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading stocks:', error);
        this.loading.set(false);
      }
    });
  }

  totalStock = computed(() => {
    return this.stocks().reduce((total, stock) => total + stock.quantiteDisponible, 0);
  });

  editStock(stock: StockResponse): void {
    // TODO: Implement stock editing modal
    console.log('Edit stock:', stock);
  }

  refreshStock(stockId: number): void {
    // TODO: Implement stock refresh
    console.log('Refresh stock:', stockId);
  }

  getStockStatusClass(quantity: number): string {
    if (quantity === 0) {
      return 'bg-red-100 text-red-800';
    } else if (quantity < 500) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  getStockStatusLabel(quantity: number): string {
    if (quantity === 0) {
      return 'ÉPUISÉ';
    } else if (quantity < 500) {
      return 'CRITIQUE';
    } else {
      return 'DISPONIBLE';
    }
  }
}
