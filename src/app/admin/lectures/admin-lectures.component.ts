import { Component, DestroyRef, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { ImageUploadComponent } from '../_shared/image-upload/image-upload.component';
import { RichTextEditorComponent } from '../_shared/rich-text-editor/rich-text-editor.component';
import { Lecture, LectureType } from '../../core/models/lecture.model';

const trimmedRequired: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { required: true };

@Component({
  selector: 'app-admin-lectures',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent, RichTextEditorComponent, DatePipe],
  templateUrl: './admin-lectures.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-lectures.component.scss',
})
export class AdminLecturesComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  lectures = signal<Lecture[]>([]);
  loading = signal(true);
  error = signal('');
  editing = signal<Lecture | null>(null);
  showForm = signal(false);

  form = this.fb.group({
    type: this.fb.nonNullable.control<LectureType>('SCHEDULED', Validators.required),
    title: ['', trimmedRequired],
    subtitle: [''],
    summary: [''],
    description: ['', trimmedRequired],
    audience: [''],
    durationLabel: [''],
    location: ['', trimmedRequired],
    date: [''],
    minimumParticipants: this.fb.control<number | null>(null),
    price: this.fb.control<number | null>(null),
    sortOrder: this.fb.nonNullable.control(0),
    imageUrl: [''],
    isActive: this.fb.nonNullable.control(true),
    highlights: this.fb.array<FormControl<string>>([]),
  });

  ngOnInit() {
    this.loadItems();
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => this.applyTypeRules(type));
  }

  get highlights() {
    return this.form.controls.highlights;
  }

  private newHighlight(value = '') {
    return this.fb.nonNullable.control(value);
  }

  addHighlight() {
    this.highlights.push(this.newHighlight());
  }

  removeHighlight(index: number) {
    this.highlights.removeAt(index);
  }

  /** Toggles required validators and clears stale conditional values on type change. */
  private applyTypeRules(type: LectureType) {
    const { date, minimumParticipants, price } = this.form.controls;
    if (type === 'SCHEDULED') {
      date.setValidators([Validators.required]);
      minimumParticipants.clearValidators();
      minimumParticipants.setValue(null);
      price.setValidators([Validators.min(0)]);
    } else {
      date.clearValidators();
      date.setValue('');
      minimumParticipants.setValidators([Validators.required, Validators.min(1)]);
      price.setValidators([Validators.min(0)]);
    }
    date.updateValueAndValidity();
    minimumParticipants.updateValueAndValidity();
    price.updateValueAndValidity();
  }

  private setHighlights(values: string[]) {
    this.highlights.clear();
    values.forEach((v) => this.highlights.push(this.newHighlight(v)));
  }

  openCreate() {
    this.editing.set(null);
    this.error.set('');
    this.form.reset({
      type: 'SCHEDULED',
      title: '',
      subtitle: '',
      summary: '',
      description: '',
      audience: '',
      durationLabel: '',
      location: '',
      date: '',
      minimumParticipants: null,
      price: null,
      sortOrder: 0,
      imageUrl: '',
      isActive: true,
    });
    this.setHighlights([]);
    this.applyTypeRules('SCHEDULED');
    this.showForm.set(true);
  }

  openEdit(item: Lecture) {
    this.editing.set(item);
    this.error.set('');
    this.form.reset({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle ?? '',
      summary: item.summary ?? '',
      description: item.description,
      audience: item.audience ?? '',
      durationLabel: item.durationLabel ?? '',
      location: item.location ?? '',
      date: item.date ? this.toDateInput(item.date) : '',
      minimumParticipants: item.minimumParticipants,
      price: item.price,
      sortOrder: item.sortOrder ?? 0,
      imageUrl: item.imageUrl ?? '',
      isActive: item.isActive,
    });
    this.setHighlights(item.highlights ?? []);
    this.applyTypeRules(item.type);
    this.showForm.set(true);
  }

  cancel() {
    this.showForm.set(false);
  }

  onImageUrlChange(url: string | null): void {
    this.form.patchValue({ imageUrl: url ?? '' });
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || this.form.touched);
  }

  isPubliclyVisible(item: Lecture): boolean {
    if (!item.isActive) return false;
    if (item.type === 'ON_DEMAND') return true;
    return !!item.date && new Date(item.date) >= new Date();
  }

  loadItems() {
    this.loading.set(true);
    this.api
      .get<PaginatedResponse<Lecture>>('/lectures/admin/all', { locale: 'he', limit: 100 })
      .subscribe({
        next: (res) => {
          this.lectures.set(res.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('שגיאה בטעינת הרצאות');
          this.loading.set(false);
        },
      });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error.set('אנא מלא את כל השדות הנדרשים');
      return;
    }
    this.error.set('');

    const v = this.form.getRawValue();
    const isScheduled = v.type === 'SCHEDULED';
    const cleanHighlights = v.highlights.map((h) => h.trim()).filter((h) => h.length > 0);
    const editing = this.editing();

    const body: Record<string, unknown> = {
      type: v.type,
      title: v.title,
      description: v.description,
      location: v.location,
      highlights: cleanHighlights,
      sortOrder: v.sortOrder ?? 0,
      isActive: v.isActive,
      price: v.price === null || (v.price as unknown) === '' ? null : Number(v.price),
      date: isScheduled && v.date ? new Date(v.date).toISOString() : null,
      minimumParticipants: isScheduled ? null : v.minimumParticipants,
    };
    const optionalText = {
      subtitle: v.subtitle?.trim() ?? '',
      summary: v.summary?.trim() ?? '',
      audience: v.audience?.trim() ?? '',
      durationLabel: v.durationLabel?.trim() ?? '',
    };
    if (editing) {
      Object.entries(optionalText).forEach(([key, value]) => {
        body[key] = value || null;
      });
    } else {
      Object.entries(optionalText).forEach(([key, value]) => {
        if (value) body[key] = value;
      });
    }
    if (editing) body['imageUrl'] = v.imageUrl || null;
    else if (v.imageUrl) body['imageUrl'] = v.imageUrl;
    // locale is only accepted on create; the strict PATCH schema rejects it.
    if (!editing) body['locale'] = 'he';

    const request$ = editing
      ? this.api.patch(`/lectures/${editing.id}`, body)
      : this.api.post('/lectures', body);

    request$.subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadItems();
      },
      error: (err: HttpErrorResponse) => this.error.set(this.describeError(err, editing ? 'שגיאה בעדכון' : 'שגיאה ביצירה')),
    });
  }

  private describeError(err: HttpErrorResponse, fallback: string): string {
    const fieldErrors = err?.error?.error?.fieldErrors as Record<string, string[]> | undefined;
    if (fieldErrors) {
      const messages = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${errs.join(', ')}`)
        .join('; ');
      if (messages) return messages;
    }
    return fallback;
  }

  deleteItem(item: Lecture) {
    this.api.delete(`/lectures/${item.id}`).subscribe({
      next: () => this.loadItems(),
      error: () => this.error.set('שגיאה במחיקה'),
    });
  }

  private toDateInput(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
