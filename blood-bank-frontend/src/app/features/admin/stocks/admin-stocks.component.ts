import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { StockResponse, NiveauStock, GroupeSanguin } from '../../../core/models/types';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';

@Component({
  selector: 'app-admin-stocks',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, BloodTypeBadgeComponent],
  templateUrl: './admin-stocks.component.html',
})
export class AdminStocksComponent implements OnInit {
  stocks = signal<StockResponse[]>([]);
  loading = signal(true);
  editingStockId = signal<number | null>(null);
  editQuantite = signal<number>(0);
  editingSeuilsStockId = signal<number | null>(null);
  editSeuilAlerte = signal<number>(2000);
  editSeuilCritique = signal<number>(1000);
  processing = signal(false);
  viewMode = signal<'grid' | 'list'>('grid');

  // Blood group order for display
  bloodGroupOrder: GroupeSanguin[] = ['O_POSITIF', 'O_NEGATIF', 'A_POSITIF', 'A_NEGATIF', 'B_POSITIF', 'B_NEGATIF', 'AB_POSITIF', 'AB_NEGATIF'];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading.set(true);
    this.adminApi.getStocks().subscribe({
      next: (data) => this.stocks.set(data),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  // Computed values for summary cards
  totalStock = computed(() => this.stocks().reduce((sum, s) => sum + s.quantiteDisponible, 0));
  totalPoches = computed(() => this.stocks().reduce((sum, s) => sum + s.nombrePoches, 0));
  
  stocksCritiques = computed(() => this.stocks().filter(s => s.niveauStock === 'CRITIQUE'));
  stocksAlertes = computed(() => this.stocks().filter(s => s.niveauStock === 'ALERTE'));
  stocksOptimaux = computed(() => this.stocks().filter(s => s.niveauStock === 'OPTIMAL'));

  // Sort stocks by blood group order
  sortedStocks = computed(() => {
    return [...this.stocks()].sort((a, b) => {
      const indexA = this.bloodGroupOrder.indexOf(a.groupeSanguin);
      const indexB = this.bloodGroupOrder.indexOf(b.groupeSanguin);
      return indexA - indexB;
    });
  });

  // Get max quantity for chart scaling
  maxQuantity = computed(() => Math.max(...this.stocks().map(s => s.quantiteDisponible), 1));

  getNiveauColor(niveau: NiveauStock): string {
    const colors: Record<NiveauStock, string> = {
      'CRITIQUE': 'text-red-600 bg-red-50 border-red-200',
      'ALERTE': 'text-orange-600 bg-orange-50 border-orange-200',
      'NORMAL': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'OPTIMAL': 'text-green-600 bg-green-50 border-green-200',
    };
    return colors[niveau] || 'text-gray-600 bg-gray-50 border-gray-200';
  }

  getNiveauLabel(niveau: NiveauStock): string {
    const labels: Record<NiveauStock, string> = {
      'CRITIQUE': 'Critique',
      'ALERTE': 'Alerte',
      'NORMAL': 'Normal',
      'OPTIMAL': 'Optimal',
    };
    return labels[niveau] || niveau;
  }

  getProgressColor(niveau: NiveauStock): string {
    const colors: Record<NiveauStock, string> = {
      'CRITIQUE': 'bg-red-500',
      'ALERTE': 'bg-orange-500',
      'NORMAL': 'bg-yellow-500',
      'OPTIMAL': 'bg-green-500',
    };
    return colors[niveau] || 'bg-gray-500';
  }

  getBarHeight(quantite: number): string {
    const percentage = (quantite / this.maxQuantity()) * 100;
    return `${Math.max(percentage, 5)}%`; // Minimum 5% for visibility
  }

  startEdit(stock: StockResponse): void {
    this.editingStockId.set(stock.id);
    this.editQuantite.set(stock.quantiteDisponible);
  }

  cancelEdit(): void {
    this.editingStockId.set(null);
    this.editQuantite.set(0);
  }

  saveEdit(stockId: number): void {
    if (this.editQuantite() < 0) {
      alert('La quantité ne peut pas être négative');
      return;
    }

    this.processing.set(true);
    this.adminApi.updateStock(stockId, this.editQuantite()).subscribe({
      next: (updated) => {
        this.stocks.update(list => 
          list.map(s => s.id === updated.id ? updated : s)
        );
        this.editingStockId.set(null);
        this.processing.set(false);
      },
      error: (err) => {
        this.processing.set(false);
        alert(err.error?.message || 'Erreur lors de la mise à jour du stock');
      }
    });
  }

  adjustQuantite(delta: number): void {
    const newValue = this.editQuantite() + delta;
    if (newValue >= 0) {
      this.editQuantite.set(newValue);
    }
  }

  // Threshold editing
  startEditSeuils(stock: StockResponse): void {
    this.editingSeuilsStockId.set(stock.id);
    this.editSeuilAlerte.set(stock.seuilAlerte);
    this.editSeuilCritique.set(stock.seuilCritique);
  }

  cancelEditSeuils(): void {
    this.editingSeuilsStockId.set(null);
    this.editSeuilAlerte.set(2000);
    this.editSeuilCritique.set(1000);
  }

  saveEditSeuils(stockId: number): void {
    if (this.editSeuilCritique() >= this.editSeuilAlerte()) {
      alert('Le seuil critique doit être inférieur au seuil d\'alerte');
      return;
    }
    if (this.editSeuilAlerte() <= 0 || this.editSeuilCritique() <= 0) {
      alert('Les seuils doivent être positifs');
      return;
    }

    this.processing.set(true);
    this.adminApi.updateStockSeuils(stockId, this.editSeuilAlerte(), this.editSeuilCritique()).subscribe({
      next: (updated) => {
        this.stocks.update(list => 
          list.map(s => s.id === updated.id ? updated : s)
        );
        this.editingSeuilsStockId.set(null);
        this.processing.set(false);
      },
      error: (err) => {
        this.processing.set(false);
        alert(err.error?.message || 'Erreur lors de la mise à jour des seuils');
      }
    });
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  getGroupeSanguinShortLabel(groupe: GroupeSanguin): string {
    const labels: Record<GroupeSanguin, string> = {
      'A_POSITIF': 'A+',
      'A_NEGATIF': 'A-',
      'B_POSITIF': 'B+',
      'B_NEGATIF': 'B-',
      'AB_POSITIF': 'AB+',
      'AB_NEGATIF': 'AB-',
      'O_POSITIF': 'O+',
      'O_NEGATIF': 'O-',
    };
    return labels[groupe] || groupe;
  }
}
