import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  @Input() variant: 'card' | 'text' | 'table-row' = 'text';
  @Input() rows = 3;
  @Input() cols = 4;
  @Input() className = '';
}
