import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar />
      <div class="flex-1 flex flex-col min-w-0">
        <app-header />
        <main class="flex-1 overflow-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {}
