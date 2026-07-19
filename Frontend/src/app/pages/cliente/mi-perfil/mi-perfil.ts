import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { TravelApiService } from '../../../services/travel-api.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  nationality?: string | null;
  passport?: string | null;
  phone?: string | null;
  preferences?: string | null;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Skeleton],
  templateUrl: './mi-perfil.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiPerfil implements OnInit {
  profile: CustomerProfile | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  noProfile = false;

  form = {
    name: '',
    phone: '',
    nationality: '',
    passport: '',
    preferences: '',
  };

  constructor(
    private readonly api: TravelApiService,
    public auth: AuthService,
    private readonly notification: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getMyProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.form.name = res.name;
        this.form.phone = res.phone ?? '';
        this.form.nationality = res.nationality ?? '';
        this.form.passport = res.passport ?? '';
        this.form.preferences = res.preferences ?? '';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.noProfile = true;
        } else {
          this.errorMessage = 'Error al cargar perfil.';
        }
        this.cdr.markForCheck();
      },
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.api.updateMyProfile({
      name: this.form.name || undefined,
      phone: this.form.phone || undefined,
      nationality: this.form.nationality || undefined,
      passport: this.form.passport || undefined,
      preferences: this.form.preferences || undefined,
    }).subscribe({
      next: (res) => {
        this.profile = res;
        this.isSaving = false;
        this.cdr.markForCheck();
        this.notification.show('Perfil actualizado correctamente', 'success');
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al guardar el perfil.';
        this.cdr.markForCheck();
      },
    });
  }
}
