import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { NotificationApiService } from '../../core/services/api/notification-api.service';
import type { NotificationResponse, TypeNotification, PrioriteNotification } from '../../core/models/types';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Centre de notifications</h2>
        <button
          (click)="markAllAsRead()"
          [disabled]="unreadCount() === 0"
          class="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          Marquer tout comme lu
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Notifications totales</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ notifications().length }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-blue-300">notifications</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Non lues</p>
              <p class="text-2xl font-semibold text-red-600 mt-1">{{ unreadCount() }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-red-300">mail</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Mise à jour</p>
              <p class="text-sm font-medium text-gray-900 mt-1">Automatique</p>
              <p class="text-xs text-green-600 mt-1">{{ isPolling() ? '🟢 Active' : '⚪ Inactive' }}</p>
            </div>
            <span class="material-symbols-outlined text-3xl text-green-300">{{ isPolling() ? 'check_circle' : 'schedule' }}</span>
          </div>
        </div>
      </div>

      <!-- Notifications list -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        @if (loading()) {
          <p class="px-6 py-4 text-gray-500">Chargement des notifications...</p>
        } @else {
          <div class="divide-y divide-gray-200">
            @for (notif of notifications(); track notif.id) {
              <div
                class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                [class.bg-blue-50]="!notif.lue"
                (click)="markAsRead(notif.id)"
              >
                <div class="flex items-start gap-4">
                  <!-- Icon -->
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    [style.backgroundColor]="getTypeColor(notif.type) + '20'"
                  >
                    {{ getTypeIcon(notif.type) }}
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ notif.titre }}</p>
                        <p class="text-sm text-gray-600 mt-1">{{ notif.message }}</p>
                      </div>
                      @if (!notif.lue) {
                        <span class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1"></span>
                      }
                    </div>

                    <!-- Meta info -->
                    <div class="flex items-center gap-2 mt-2">
                      <span
                        class="text-xs font-medium px-2 py-1 rounded"
                        [style.backgroundColor]="getPriorityColor(notif.priorite) + '20'"
                        [style.color]="getPriorityColor(notif.priorite)"
                      >
                        {{ getPriorityLabel(notif.priorite) }}
                      </span>
                      <span
                        class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                      >
                        {{ getTypeLabel(notif.type) }}
                      </span>
                      <span class="text-xs text-gray-500 ml-auto">
                        {{ getTimeAgo(notif.dateCreation) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="px-6 py-8 text-center">
                <span class="material-symbols-outlined text-4xl text-gray-300 block mb-2">notifications_none</span>
                <p class="text-sm text-gray-500">Aucune notification pour le moment</p>
              </div>
            }
          </div>
        }
      </div>

      <!-- Auto-refresh indicator -->
      <div class="text-xs text-gray-500 text-center">
        Mise à jour automatique chaque 30 secondes
      </div>
    </div>
  `,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications = signal<NotificationResponse[]>([]);
  loading = signal(false);
  isPolling = signal(false);
  private pollingSubscription: Subscription | null = null;

  constructor(private notificationApi: NotificationApiService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private loadNotifications(): void {
    this.loading.set(true);
    this.notificationApi.getAll().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private startPolling(): void {
    this.isPolling.set(true);
    // Poll every 30 seconds
    this.pollingSubscription = interval(30000).subscribe(() => {
      this.notificationApi.getAll().subscribe({
        next: (data) => {
          this.notifications.set(data);
        },
        error: () => {},
      });
    });
  }

  markAsRead(id: number): void {
    this.notificationApi.markAsRead(id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, lue: true } : n))
        );
      },
      error: () => {},
    });
  }

  markAllAsRead(): void {
    const unreadIds = this.notifications()
      .filter((n) => !n.lue)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    unreadIds.forEach((id) => this.markAsRead(id));
  }

  unreadCount(): number {
    return this.notifications().filter((n) => !n.lue).length;
  }

  getTypeIcon(type: TypeNotification): string {
    const icons: Record<TypeNotification, string> = {
      'DON': '🩸',
      'DEMANDE': '📋',
      'ALERTES_STOCK': '⚠️',
      'CAMPAGNE': '📢',
      'SYSTEME': '⚙️',
      'INFO': 'ℹ️',
      'ALERTE': '⚠️',
      'URGENCE': '🚨',
      'SUCCES': '✅',
      'RAPPEL': '🔔',
    };
    return icons[type] || '📢';
  }

  getTypeLabel(type: TypeNotification): string {
    const labels: Record<TypeNotification, string> = {
      'DON': 'Don',
      'DEMANDE': 'Demande',
      'ALERTES_STOCK': 'Stock',
      'CAMPAGNE': 'Campagne',
      'SYSTEME': 'Système',
      'INFO': 'Info',
      'ALERTE': 'Alerte',
      'URGENCE': 'Urgence',
      'SUCCES': 'Succès',
      'RAPPEL': 'Rappel',
    };
    return labels[type] || type;
  }

  getTypeColor(type: TypeNotification): string {
    const colors: Record<TypeNotification, string> = {
      'DON': '#3B82F6',
      'DEMANDE': '#EF4444',
      'ALERTES_STOCK': '#F59E0B',
      'CAMPAGNE': '#8B5CF6',
      'SYSTEME': '#6B7280',
      'INFO': '#3B82F6',
      'ALERTE': '#F59E0B',
      'URGENCE': '#EF4444',
      'SUCCES': '#10B981',
      'RAPPEL': '#8B5CF6',
    };
    return colors[type] || '#6B7280';
  }

  getPriorityLabel(priorite: PrioriteNotification): string {
    const labels: Record<PrioriteNotification, string> = {
      'BASSE': 'Basse',
      'NORMALE': 'Normale',
      'HAUTE': 'Haute',
      'CRITIQUE': 'Critique',
    };
    return labels[priorite] || priorite;
  }

  getPriorityColor(priorite: PrioriteNotification): string {
    const colors: Record<PrioriteNotification, string> = {
      'BASSE': '#10B981',
      'NORMALE': '#3B82F6',
      'HAUTE': '#F59E0B',
      'CRITIQUE': '#EF4444',
    };
    return colors[priorite] || '#6B7280';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  }
}
