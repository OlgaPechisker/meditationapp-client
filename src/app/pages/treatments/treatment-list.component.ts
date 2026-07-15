import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SeoService } from '../../core/services/seo.service';
import { TicketCardComponent, GlassPanelComponent, PaperNoteComponent, SheenCardComponent } from '../../shared/expressive';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

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
  imports: [TranslocoPipe, TicketCardComponent, GlassPanelComponent, PaperNoteComponent, SheenCardComponent, PageHeroComponent],
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

  /**
   * WhatsApp link for a booking enquiry. Called with a treatment title for a
   * specific enquiry, or without arguments for the general hero-level CTA.
   */
  getWhatsappLink(title = ''): string {
    return title
      ? this.whatsapp.buildTreatmentLink(title)
      : this.whatsapp.buildLink('שלום, אני מעוניין/ת לקבוע תור לטיפול');
  }
}
