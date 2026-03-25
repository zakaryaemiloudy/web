import { Component } from '@angular/core';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationBellComponent],
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle() }}</h1>
      <div class="hidden md:block flex-1 max-w-md mx-4">
        <input
          type="search"
          placeholder="Rechercher..."
          class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div class="flex items-center gap-4">
        <app-notification-bell />
        <div class="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm">
          {{ initials() }}
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  pageTitle = () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('dashboard')) return 'Tableau de bord';
    if (path.includes('dons')) return 'Dons';
    if (path.includes('demandes')) return 'Demandes de sang';
    if (path.includes('stocks')) return 'Stocks';
    if (path.includes('donneurs')) return 'Donneurs';
    if (path.includes('campagnes')) return 'Campagnes';
    if (path.includes('hopitaux')) return 'Hôpitaux';
    if (path.includes('stats')) return 'Statistiques';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('profil')) return 'Mon profil';
    if (path.includes('badges')) return 'Badges';
    if (path.includes('classement')) return 'Classement';
    if (path.includes('chatbot')) return 'Chatbot';
    return 'LifeFlow';
  };

  initials(): string {
    const auth = typeof localStorage !== 'undefined' ? localStorage.getItem('lifeflow_user') : null;
    if (!auth) return '?';
    try {
      const u = JSON.parse(auth) as { nom?: string; prenom?: string };
      const n = (u.prenom?.[0] ?? '') + (u.nom?.[0] ?? '');
      return n.toUpperCase() || '?';
    } catch {
      return '?';
    }
  }
}
