import { Component, HostListener, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

interface Song {
  id: number;
  imageUrl: string;
  sortOrder: number;
  locale: string;
}

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss',
})
export class SongsComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  songs = signal<Song[]>([]);
  currentIndex = signal(0);
  loaded = signal(false);

  private touchStartX: number | null = null;

  hasSongs = computed(() => this.songs().length > 0);
  isFirst = computed(() => this.currentIndex() === 0);
  isLast = computed(() => this.currentIndex() === this.songs().length - 1);

  ngOnInit() {
    this.seo.updateMeta({ title: 'שירים', description: 'שירים של עינת שומונוב' });
    this.api.get<PaginatedResponse<Song>>('/songs', { locale: 'he', limit: 100 })
      .subscribe(res => {
        const sorted = [...res.data].sort((a, b) => a.sortOrder - b.sortOrder);
        this.songs.set(sorted);
        this.loaded.set(true);
      });
  }

  next() {
    if (this.isLast()) return;
    this.currentIndex.update(i => i + 1);
  }

  prev() {
    if (this.isFirst()) return;
    this.currentIndex.update(i => i - 1);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') { this.prev(); }
    if (event.key === 'ArrowRight') { this.next(); }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const delta = endX - this.touchStartX;
    const threshold = 40;
    if (delta > threshold) { this.prev(); }
    else if (delta < -threshold) { this.next(); }
    this.touchStartX = null;
  }
}
