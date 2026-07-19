import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { TravelApiService } from '../../services/travel-api.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email = '';

  private readonly notify = inject(NotificationService);
  private readonly travelApi = inject(TravelApiService);

  async subscribe(): Promise<void> {
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return;
    try {
      await firstValueFrom(this.travelApi.sendContact({ name: '', email: this.email, message: 'Newsletter subscription' }));
      this.notify.show('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.', 'success');
      this.email = '';
    } catch {
      this.notify.show('No se pudo procesar la suscripción. Intenta de nuevo.', 'error');
    }
  }
}
