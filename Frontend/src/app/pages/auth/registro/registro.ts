import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registro {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isSubmitting = false;
  showPassword = false;
  showConfirm = false;

  get passwordStrength(): { label: string; color: string; percent: string } {
    const p = this.password;
    let score = 0;
    if (p.length >= 6) score += 20;
    if (p.length >= 10) score += 10;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 25;
    if (/\d/.test(p)) score += 20;
    if (/[^a-zA-Z0-9]/.test(p)) score += 25;
    if (score < 30) return { label: 'Débil', color: 'bg-red-500', percent: '25%' };
    if (score < 50) return { label: 'Regular', color: 'bg-amber-500', percent: '50%' };
    if (score < 70) return { label: 'Buena', color: 'bg-yellow-500', percent: '75%' };
    return { label: 'Fuerte', color: 'bg-green-500', percent: '100%' };
  }

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notification: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  submit(): void {
    this.errorMessage = '';
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    this.isSubmitting = true;

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.notification.show('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al registrarse.';
        this.cdr.markForCheck();
      },
    });
  }
}
