import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SeoService } from '../../core/services/seo.service';
import { TicketCardComponent, GlassPanelComponent, PaperNoteComponent, SheenCardComponent } from '../../shared/expressive';

interface Treatment {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  locale: string;
  sortOrder: number;
}

@Component({
  selector: 'app-treatment-list',
  standalone: true,
  imports: [TranslocoPipe, TicketCardComponent, GlassPanelComponent, PaperNoteComponent, SheenCardComponent],
  templateUrl: './treatment-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './treatment-list.component.scss',
})
export class TreatmentListComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private whatsapp = inject(WhatsappService);
  private seo = inject(SeoService);

  treatments = signal<Treatment[]>([]);
  loaded = signal(false);

  ngOnInit() {
    this.seo.updateMeta({ title: 'טיפולים', description: 'טיפולים של עינת שומונוב' });
    const locale = this.route.snapshot.queryParamMap.get('locale') ?? 'he';
    this.api.get<PaginatedResponse<Treatment>>('/treatments', { locale, limit: 100 })
      .subscribe(res => { this.treatments.set(res.data); this.loaded.set(true); });
  }

  getWhatsappLink(title: string): string {
    return this.whatsapp.buildTreatmentLink(title);
  }
}
