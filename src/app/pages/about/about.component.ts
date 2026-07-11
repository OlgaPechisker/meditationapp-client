import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

interface SiteContent {
  id: number;
  key: string;
  value: string;
  locale: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  title = signal<string>('');
  content = signal<string>('');
  imageUrl = signal<string>('');

  ngOnInit() {
    this.seo.updateMeta({ title: 'אודות', description: 'אודות עינת שומונוב' });

    forkJoin({
      title:   this.api.get<SiteContent>('/content/about_title', { locale: 'he' }).pipe(catchError(() => of(null))),
      content: this.api.get<SiteContent>('/content/about',       { locale: 'he' }).pipe(catchError(() => of(null))),
      image:   this.api.get<SiteContent>('/content/about_image', { locale: 'he' }).pipe(catchError(() => of(null))),
    }).subscribe(({ title, content, image }) => {
      if (title)   this.title.set(title.value);
      if (content) this.content.set(content.value);
      if (image)   this.imageUrl.set(image.value);
    });
  }
}
