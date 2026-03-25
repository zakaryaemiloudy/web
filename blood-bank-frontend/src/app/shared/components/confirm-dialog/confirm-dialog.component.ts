import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" (click)="cancel.emit()">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md w-full" (click)="$event.stopPropagation()">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title() }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ message() }}</p>
        @if (showTextarea()) {
          <textarea
            [value]="reason()"
            (input)="reasonChange.emit($any($event.target).value)"
            rows="3"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-4"
            placeholder="Raison (optionnel)"
          ></textarea>
        }
        <div class="flex justify-end gap-2">
          <button type="button" (click)="cancel.emit()" class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button type="button" (click)="confirm.emit()" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  title = input('Confirmer');
  message = input('');
  confirmLabel = input('Confirmer');
  showTextarea = input(false);
  reason = input('');
  reasonChange = output<string>();
  confirm = output<void>();
  cancel = output<void>();
}
