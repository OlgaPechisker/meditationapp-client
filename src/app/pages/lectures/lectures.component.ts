import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { Lecture, groupLectures } from '../../core/models/lecture.model';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

@Component({
  selector: 'app-lectures',
  standalone: true,
  imports: [TranslocoPipe, DatePipe, RouterLink, NgTemplateOutlet, PageHeroComponent],
  templateUrl: './lectures.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lectures.component.scss',
})
export class LecturesComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  lectures = signal<Lecture[]>([]);
  loaded = signal(false);
  error = signal(false);

  private groups = computed(() => groupLectures(this.lectures()));
  scheduled = computed(() => this.groups().scheduled);
  onDemand = computed(() => this.groups().onDemand);

  isEmpty = computed(() => this.loaded() && !this.error() && this.lectures().length === 0);
  skeletons = [0, 1, 2];

  ngOnInit() {
    this.seo.updateMeta({ title: 'הרצאות', description: 'הרצאות וסדנאות של עינת שומונוב' });
    this.api.get<PaginatedResponse<Lecture>>('/lectures', { locale: 'he', limit: 100 }).subscribe({
      next: (res) => {
        this.lectures.set(res.data);
        this.loaded.set(true);
      },
      error: () => {
        this.error.set(true);
        this.loaded.set(true);
      },
    });
  }
}
