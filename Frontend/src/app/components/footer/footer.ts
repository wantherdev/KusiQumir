import { isDevMode, Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { TravelApiService } from '../../services/travel-api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  email = '';
  readonly social = environment.social;

  private readonly notify = inject(NotificationService);
  private readonly travelApi = inject(TravelApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  async subscribe(): Promise<void> {
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return;
    try {
      await firstValueFrom(this.travelApi.sendContact({ name: '', email: this.email, message: 'Newsletter subscription' }));
      this.notify.show('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.', 'success');
      this.email = '';
    } catch (e) {
      if (isDevMode()) console.error(e);
      this.notify.show('No se pudo procesar la suscripción. Intenta de nuevo.', 'error');
    } finally {
      this.cdr.markForCheck();
    }
  }
}
