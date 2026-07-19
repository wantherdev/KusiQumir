import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;
  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notification: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  submit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        const user = this.authService.user();
        this.notification.show(`Bienvenido, ${user?.email ?? ''}`, 'success');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const role = user?.role ?? '';
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (role === 'ADMIN') {
          this.router.navigateByUrl('/admin/reservas');
        } else {
          this.router.navigateByUrl('/mis-reservas');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
        this.cdr.markForCheck();
      },
    });
  }
}
