import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.html',
})
export class Skeleton {
  @Input() variant: 'card' | 'text' | 'table-row' | 'hero' = 'text';
  @Input() rows = 3;
  @Input() cols = 4;
  @Input() className = '';
}
