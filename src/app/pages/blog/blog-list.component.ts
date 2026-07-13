import { Component, inject, OnInit, signal, computed, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';
import { Subject, merge, of, debounceTime, distinctUntilChanged, skip, switchMap, tap } from 'rxjs';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { getYouTubeId, youTubeThumb, isVideoPost } from '../../core/utils/youtube';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  videoUrl?: string;
  locale: string;
  publishedAt: string;
}

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, DatePipe],
  templateUrl: './blog-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private destroyRef = inject(DestroyRef);

  posts = signal<BlogPost[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  loaded = signal(false);
  searchTerm = signal('');
  private limit = 10;

  private searchTerm$ = toObservable(this.searchTerm).pipe(
    skip(1),
    debounceTime(300),
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  );
  private reload$ = new Subject<void>();

  featured = computed(() => {
    const list = this.posts();
    return this.currentPage() === 1 && this.searchTerm() === '' ? (list[0] ?? null) : null;
  });

  rest = computed(() => {
    const list = this.posts();
    return this.featured() ? list.slice(1) : list;
  });

  ngOnInit() {
    this.seo.updateMeta({ title: 'בלוג', description: 'הבלוג של עינת שומונוב' });

    merge(
      of(undefined),
      this.searchTerm$.pipe(tap(() => this.currentPage.set(1))),
      this.reload$,
    )
      .pipe(
        switchMap(() => this.fetchPosts()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        this.posts.set(res.data);
        this.totalPages.set(Math.ceil(res.meta.total / this.limit));
        this.loaded.set(true);
      });
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value);
  }

  cardVariant(index: number): string {
    return (index + 1) % 3 === 0 ? 'card--wide' : '';
  }

  cardImage(post: BlogPost): string {
    if (post.imageUrl) return post.imageUrl;
    const id = getYouTubeId(post.videoUrl);
    return id ? youTubeThumb(id) : '';
  }

  hasVideo(post: BlogPost): boolean {
    return isVideoPost(post);
  }

  private fetchPosts() {
    const params: Record<string, string | number> = {
      locale: 'he',
      page: this.currentPage(),
      limit: this.limit,
    };
    if (this.searchTerm()) {
      params['search'] = this.searchTerm();
    }
    return this.api.get<PaginatedResponse<BlogPost>>('/blog', params);
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.reload$.next();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.reload$.next();
    }
  }
}
