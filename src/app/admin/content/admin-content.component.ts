import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { ImageUploadComponent } from '../_shared/image-upload/image-upload.component';

interface SiteContent {
  id: number;
  key: string;
  value: string;
  locale: string;
}

type SaveState = 'idle' | 'saving' | 'success' | 'error';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent],
  templateUrl: './admin-content.component.html',
  styleUrl: './admin-content.component.scss',
})
export class AdminContentComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  loading = signal(true);

  aboutForm = this.fb.group({
    title: ['', Validators.required],
    text: ['', Validators.required],
  });
  aboutImageUrl = signal<string | null>(null);
  aboutSaveState = signal<SaveState>('idle');

  contactForm = this.fb.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  contactSaveState = signal<SaveState>('idle');

  ngOnInit() {
    forkJoin({
      aboutTitle:   this.api.get<SiteContent>('/content/about_title',   { locale: 'he' }).pipe(catchError(() => of(null))),
      aboutText:    this.api.get<SiteContent>('/content/about',         { locale: 'he' }).pipe(catchError(() => of(null))),
      aboutImage:   this.api.get<SiteContent>('/content/about_image',   { locale: 'he' }).pipe(catchError(() => of(null))),
      contactPhone: this.api.get<SiteContent>('/content/contact_phone', { locale: 'he' }).pipe(catchError(() => of(null))),
      contactEmail: this.api.get<SiteContent>('/content/contact_email', { locale: 'he' }).pipe(catchError(() => of(null))),
    }).subscribe(({ aboutTitle, aboutText, aboutImage, contactPhone, contactEmail }) => {
      this.aboutForm.patchValue({
        title: aboutTitle?.value ?? '',
        text:  aboutText?.value  ?? '',
      });
      this.aboutImageUrl.set(aboutImage?.value ?? null);
      this.contactForm.patchValue({
        phone: contactPhone?.value ?? '',
        email: contactEmail?.value ?? '',
      });
      this.loading.set(false);
    });
  }

  saveAbout() {
    if (this.aboutForm.invalid) return;
    this.aboutSaveState.set('saving');

    const { title, text } = this.aboutForm.value;
    const imageUrl = this.aboutImageUrl();

    forkJoin([
      this.api.put('/content', { key: 'about_title', value: title!, locale: 'he' }),
      this.api.put('/content', { key: 'about',       value: text!,  locale: 'he' }),
      imageUrl
        ? this.api.put('/content', { key: 'about_image', value: imageUrl, locale: 'he' })
        : of(null),
    ]).subscribe({
      next: () => this.aboutSaveState.set('success'),
      error: () => this.aboutSaveState.set('error'),
    });
  }

  saveContact() {
    if (this.contactForm.invalid) return;
    this.contactSaveState.set('saving');

    const { phone, email } = this.contactForm.value;

    forkJoin([
      this.api.put('/content', { key: 'contact_phone', value: phone!, locale: 'he' }),
      this.api.put('/content', { key: 'contact_email', value: email!, locale: 'he' }),
    ]).subscribe({
      next: () => this.contactSaveState.set('success'),
      error: () => this.contactSaveState.set('error'),
    });
  }
}
