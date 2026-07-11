import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateMeta({ title: 'הדף לא נמצא' });
  }
}
