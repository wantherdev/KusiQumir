import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" [attr.aria-label]="title" [attr.aria-describedby]="'confirm-msg-' + uid">
      <div class="fixed inset-0 bg-black/50" (click)="cancel()"></div>
      <div class="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <i class="ri-alert-line text-2xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-tertiary">{{ title }}</h3>
            <p [id]="'confirm-msg-' + uid" class="mt-1 text-sm text-slate-600">{{ message }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button #cancelBtn (click)="cancel()" class="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            {{ cancelLabel }}
          </button>
          <button (click)="confirm()" [class]="confirmClass + ' rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110'">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialog implements OnChanges {
  @Input() visible = false;
  @Input() title = 'Confirmar';
  @Input() message = '¿Estás seguro?';
  @Input() confirmLabel = 'Eliminar';
  @Input() cancelLabel = 'Cancelar';
  @Input() confirmClass = 'bg-red-600';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('cancelBtn') private readonly cancelBtn!: ElementRef<HTMLButtonElement>;

  uid = Math.random().toString(36).slice(2, 8);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible) this.cancel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      setTimeout(() => this.cancelBtn?.nativeElement?.focus());
    }
  }

  confirm(): void {
    this.visible = false;
    this.confirmed.emit();
  }

  cancel(): void {
    this.visible = false;
    this.cancelled.emit();
  }
}
