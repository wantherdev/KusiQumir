import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nosotros implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Nosotros | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Kusi Q\'umir es una agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
    this.meta.updateTag({ property: 'og:title', content: 'Nosotros | Kusi Q\'umir' });
    this.meta.updateTag({ property: 'og:description', content: 'Agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Nosotros | Kusi Q\'umir' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
  }
}
