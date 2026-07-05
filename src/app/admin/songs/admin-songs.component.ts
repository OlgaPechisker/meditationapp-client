import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { ImageUploadComponent } from '../_shared/image-upload/image-upload.component';

interface Song {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

@Component({
  selector: 'app-admin-songs',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-songs.component.html',
  styleUrl: './admin-songs.component.scss',
})
export class AdminSongsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  songs = signal<Song[]>([]);
  loading = signal(true);
  error = signal('');
  editing = signal<Song | null>(null);
  showForm = signal(false);

  form = this.fb.group({
    imageUrl: ['', Validators.required],
    sortOrder: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.api.get<PaginatedResponse<Song>>('/songs/admin/all', { locale: 'he', limit: 100 }).subscribe({
      next: (res) => {
        const sorted = [...res.data].sort((a, b) => a.sortOrder - b.sortOrder);
        this.songs.set(sorted);
        this.loading.set(false);
      },
      error: () => { this.error.set('שגיאה בטעינת שירים'); this.loading.set(false); },
    });
  }

  openCreate() {
    this.editing.set(null);
    this.form.reset({ imageUrl: '', sortOrder: 0 });
    this.showForm.set(true);
  }

  openEdit(item: Song) {
    this.editing.set(item);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  cancel() { this.showForm.set(false); }

  onImageUrlChange(url: string | null): void {
    this.form.patchValue({ imageUrl: url ?? '' });
  }

  save() {
    if (this.form.invalid) { this.error.set('אנא מלא את כל השדות הנדרשים, כולל תמונה'); return; }
    const body = { ...this.form.value, locale: 'he' };
    const editing = this.editing();

    if (editing) {
      this.api.patch(`/songs/${editing.id}`, body).subscribe({
        next: () => { this.showForm.set(false); this.loadItems(); },
        error: () => this.error.set('שגיאה בעדכון'),
      });
    } else {
      this.api.post('/songs', body).subscribe({
        next: () => { this.showForm.set(false); this.loadItems(); },
        error: () => this.error.set('שגיאה ביצירה'),
      });
    }
  }

  deleteItem(item: Song) {
    this.api.delete(`/songs/${item.id}`).subscribe({
      next: () => this.loadItems(),
      error: () => this.error.set('שגיאה במחיקה'),
    });
  }
}
