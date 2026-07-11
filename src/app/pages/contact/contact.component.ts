import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { ApiService } from '../../core/services/api.service';
import { CtaFormComponent } from '../../shared/cta-form/cta-form.component';

interface SiteContent {
  id: number;
  key: string;
  value: string;
  locale: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslocoPipe, CtaFormComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private seo = inject(SeoService);
  private api = inject(ApiService);

  email = signal('einat@example.com');
  phone = signal('050-1234567');

  ngOnInit() {
    this.seo.updateMeta({ title: 'צור קשר', description: 'יצירת קשר עם עינת שומונוב' });

    forkJoin({
      phone: this.api.get<SiteContent>('/content/contact_phone', { locale: 'he' }).pipe(catchError(() => of(null))),
      email: this.api.get<SiteContent>('/content/contact_email', { locale: 'he' }).pipe(catchError(() => of(null))),
    }).subscribe(({ phone, email }) => {
      if (phone) this.phone.set(phone.value);
      if (email) this.email.set(email.value);
    });
  }
}
