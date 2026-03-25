import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationApiService } from '../../../core/services/api/notification-api.service';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import type { NotificationResponse, TypeNotification, PrioriteNotification } from '../../../core/models/types';

@Component({
  selector: 'app-global-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Notifications globales</h2>
      </div>

      @if (error()) {
        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ error() }}
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Liste des notifications -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Historique des notifications</h3>
            <p class="text-xs text-gray-500">{{ notifications().length }} notification(s)</p>
          </div>
          @if (loading()) {
            <p class="px-6 py-4 text-sm text-gray-500">Chargement des notifications...</p>
          } @else {
            <ul class="divide-y divide-gray-200">
              @for (n of notifications(); track n.id) {
                <li class="px-6 py-4 flex items-start gap-3">
                  <span
                    class="material-symbols-outlined text-lg mt-0.5"
                    [class]="iconClass(n.type)"
                  >
                    {{ iconForType(n.type) }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ n.titre }}
                      <span
                        class="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        [ngClass]="badgeClass(n.priorite)"
                      >
                        {{ n.priorite }}
                      </span>
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ n.dateCreation | date:'short' }}
                    </p>
                    <p class="text-xs text-gray-600 mt-1">
                      {{ n.message }}
                    </p>
                  </div>
                </li>
              } @empty {
                <li class="px-6 py-6 text-sm text-gray-500 text-center">
                  Aucune notification pour le moment.
                </li>
              }
            </ul>
          }
        </div>

        <!-- Envoi d'une notification globale -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Envoyer une notification globale</h3>
          <form [formGroup]="form" (ngSubmit)="send()" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                formControlName="titre"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows="3"
                formControlName="message"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  formControlName="type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="INFO">Info</option>
                  <option value="ALERTE">Alerte</option>
                  <option value="URGENCE">Urgence</option>
                  <option value="SUCCES">Succès</option>
                  <option value="RAPPEL">Rappel</option>
                  <option value="SYSTEME">Système</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  formControlName="priorite"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="BASSE">Basse</option>
                  <option value="NORMALE">Normale</option>
                  <option value="HAUTE">Haute</option>
                  <option value="CRITIQUE">Critique</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Visible par (rôle)</label>
              <select
                formControlName="roleCible"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tous les utilisateurs</option>
                <option value="USER">Donateurs</option>
                <option value="ADMIN">Admins d'hôpital</option>
                <option value="SUPER_ADMIN">Super admins</option>
              </select>
            </div>
            <button
              type="submit"
              [disabled]="form.invalid || sending()"
              class="w-full mt-2 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ sending() ? 'Envoi...' : 'Envoyer' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class GlobalNotificationsComponent implements OnInit {
  notifications = signal<NotificationResponse[]>([]);
  loading = signal(true);
  sending = signal(false);
  error = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationApi: NotificationApiService,
    private superAdminApi: SuperAdminApiService
  ) {
    this.form = this.fb.nonNullable.group({
      titre: ['', [Validators.required]],
      message: ['', [Validators.required]],
      type: ['INFO' as TypeNotification, [Validators.required]],
      priorite: ['NORMALE' as PrioriteNotification, [Validators.required]],
      roleCible: [''],
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.loading.set(true);
    this.notificationApi.getAll().subscribe({
      next: (list) => {
        this.notifications.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ??
            err?.message ??
            'Erreur lors du chargement des notifications.'
        );
      },
    });
  }

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    const payload = this.form.getRawValue();
    this.superAdminApi.sendGlobalNotification(payload).subscribe({
      next: () => {
        this.sending.set(false);
        this.form.reset({
          type: 'INFO',
          priorite: 'NORMALE',
          roleCible: '',
        });
        this.loadNotifications();
      },
      error: (err) => {
        this.sending.set(false);
        this.error.set(
          err?.error?.message ??
            err?.message ??
            'Erreur lors de l’envoi de la notification.'
        );
      },
    });
  }

  iconForType(type: TypeNotification): string {
    switch (type) {
      case 'URGENCE':
        return 'emergency';
      case 'ALERTE':
        return 'warning';
      case 'SUCCES':
        return 'check_circle';
      case 'RAPPEL':
        return 'schedule';
      case 'SYSTEME':
        return 'settings';
      default:
        return 'notifications';
    }
  }

  iconClass(type: TypeNotification): string {
    if (type === 'URGENCE') return 'text-red-600';
    if (type === 'ALERTE') return 'text-orange-500';
    if (type === 'SUCCES') return 'text-green-600';
    return 'text-gray-500';
  }

  badgeClass(prio: PrioriteNotification): string {
    if (prio === 'CRITIQUE') return 'bg-red-100 text-red-700';
    if (prio === 'HAUTE') return 'bg-orange-100 text-orange-800';
    if (prio === 'BASSE') return 'bg-sky-100 text-sky-800';
    return 'bg-gray-100 text-gray-700';
  }
}
