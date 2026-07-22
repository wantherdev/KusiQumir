import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Category } from './category.model';

@Component({
  selector: 'app-testimonial-category-selector',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestimonialCategorySelectorComponent),
      multi: true,
    },
  ],
  templateUrl: './testimonial-category-selector.component.html',
  styleUrl: './testimonial-category-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCategorySelectorComponent implements ControlValueAccessor {
  readonly categories = input.required<Category[]>();
  readonly placeholder = input('Selecciona una o más categorías');
  readonly disabled = input(false);

  readonly selectionChange = output<string[]>();

  private disabledSig = signal(false);
  private selectedIdsSig = signal<string[]>([]);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  available = computed(() =>
    this.categories().filter((c) => !this.selectedIdsSig().includes(c.id)),
  );

  selected = computed(() =>
    this.selectedIdsSig()
      .map((id) => this.categories().find((c) => c.id === id))
      .filter((c): c is Category => c !== undefined),
  );

  isDisabled(): boolean {
    return this.disabled() || this.disabledSig();
  }

  select(category: Category): void {
    if (this.isDisabled()) return;
    const ids = [...this.selectedIdsSig()];
    if (!ids.includes(category.id)) {
      ids.push(category.id);
      this.selectedIdsSig.set(ids);
      this.emitChange();
    }
  }

  deselect(id: string): void {
    if (this.isDisabled()) return;
    const ids = this.selectedIdsSig().filter((i) => i !== id);
    this.selectedIdsSig.set(ids);
    this.emitChange();
  }

  onDrop(event: CdkDragDrop<Category[]>): void {
    if (this.isDisabled()) return;
    const category = event.item.data as Category;

    if (event.previousContainer === event.container) {
      const ids = [...this.selectedIdsSig()];
      moveItemInArray(ids, event.previousIndex, event.currentIndex);
      this.selectedIdsSig.set(ids);
    } else if (event.container.id === 'selected') {
      const ids = [...this.selectedIdsSig()];
      ids.splice(event.currentIndex, 0, category.id);
      this.selectedIdsSig.set(ids);
    } else {
      const ids = this.selectedIdsSig().filter((id) => id !== category.id);
      this.selectedIdsSig.set(ids);
    }
    this.emitChange();
  }

  onKeydown(event: KeyboardEvent, category: Category): void {
    if (this.isDisabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(category);
    }
  }

  onKeydownRemove(event: KeyboardEvent, id: string): void {
    if (this.isDisabled()) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.deselect(id);
    }
  }

  toAriaLabel(category: Category): string {
    const isSelected = this.selectedIdsSig().includes(category.id);
    return `${category.name}, ${isSelected ? 'seleccionada' : 'no seleccionada'}. Presiona Enter o Espacio para ${isSelected ? 'deseleccionar' : 'seleccionar'}.`;
  }

  private emitChange(): void {
    this.onChange(this.selectedIdsSig());
    this.onTouched();
    this.selectionChange.emit(this.selectedIdsSig());
  }

  writeValue(value: string[]): void {
    this.selectedIdsSig.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSig.set(isDisabled);
  }
}
