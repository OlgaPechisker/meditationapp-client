import { Component, DestroyRef, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SeoService } from '../../core/services/seo.service';
import { Lecture } from '../../core/models/lecture.model';

@Component({
  selector: 'app-lecture-detail',
  standalone: true,
  imports: [TranslocoPipe, DatePipe, RouterLink],
  templateUrl: './lecture-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lecture-detail.component.scss',
})
export class LectureDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private whatsapp = inject(WhatsappService);
  private seo = inject(SeoService);
  private destroyRef = inject(DestroyRef);

  lecture = signal<Lecture | null>(null);
  loaded = signal(false);
  notFound = signal(false);
  error = signal(false);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.lecture.set(null);
          this.loaded.set(false);
          this.notFound.set(false);
          this.error.set(false);

          const slug = params.get('slug');
          if (!slug) {
            this.notFound.set(true);
            this.loaded.set(true);
            return EMPTY;
          }

          return this.api.get<Lecture>(`/lectures/${slug}`, { locale: 'he' }).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 404) this.notFound.set(true);
              else this.error.set(true);
              this.loaded.set(true);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((l) => {
        this.lecture.set(l);
        this.loaded.set(true);
        this.seo.updateMeta({
          title: l.title,
          description: l.summary ?? undefined,
          image: l.imageUrl ?? undefined,
        });
      });
  }

  isScheduled(l: Lecture): boolean {
    return l.type === 'SCHEDULED';
  }

  whatsappLink(l: Lecture): string {
    if (l.type === 'SCHEDULED') {
      const formatted = l.date ? formatDate(l.date, 'dd/MM/yyyy', 'en-US') : '';
      return this.whatsapp.buildScheduledLectureLink(l.title, formatted);
    }
    return this.whatsapp.buildOnDemandLectureLink(l.title, l.minimumParticipants);
  }
}
