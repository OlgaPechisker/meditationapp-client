import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WhatsappService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly whatsapp = inject(WhatsappService);
  currentYear = new Date().getFullYear();
}
