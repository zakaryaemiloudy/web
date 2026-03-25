import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { NotificationApiService } from '../../../core/services/api/notification-api.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/notifications" class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
      <span class="material-symbols-outlined text-2xl">notifications</span>
      @if (unreadCount() > 0) {
        <span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-medium px-1">
          {{ unreadCount() > 99 ? '99+' : unreadCount() }}
        </span>
      }
    </a>
  `,
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadCount = signal(0);
  private sub: Subscription | null = null;

  constructor(private notificationApi: NotificationApiService) {}

  ngOnInit(): void {
    this.sub = interval(30_000)
      .pipe(
        startWith(0),
        switchMap(() => this.notificationApi.getUnreadCount())
      )
      .subscribe({
        next: (c) => this.unreadCount.set(typeof c === 'number' ? c : 0),
        error: () => this.unreadCount.set(0),
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
