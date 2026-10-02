import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

interface SiteContent {
  value: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private api = inject(ApiService);
  private readonly number = signal<string | null>(null);
  readonly phoneNumber = this.number.asReadonly();
  readonly contactLink = computed(() => {
    const number = this.number();
    return number ? `https://wa.me/${number}` : null;
  });
  readonly error = signal(false);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.number.set(null);
    this.error.set(false);
    this.api.get<SiteContent>('/content/contact_phone', { locale: 'he' }).subscribe({
      next: ({ value }) => {
        const digits = value.trim().replace(/[\s()+-]/g, '');
        const number = digits.startsWith('0') ? `972${digits.slice(1)}` : digits;
        if (!/^[1-9]\d{7,14}$/.test(number)) {
          console.error('Invalid contact phone number for WhatsApp');
          this.number.set(null);
          this.error.set(true);
          return;
        }
        this.number.set(number);
        this.error.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load contact phone number for WhatsApp', error);
        this.number.set(null);
        this.error.set(true);
      },
    });
  }

  buildLink(message: string): string | null {
    const link = this.contactLink();
    return link ? `${link}?text=${encodeURIComponent(message)}` : null;
  }

  buildTreatmentLink(treatmentTitle: string): string | null {
    return this.buildLink(`שלום, אני מתעניין/ת בטיפול: ${treatmentTitle}`);
  }

  /**
   * Registration enquiry for a scheduled lecture — includes the lecture title
   * and the formatted event date.
   */
  buildScheduledLectureLink(title: string, formattedDate: string): string | null {
    const dateSuffix = formattedDate ? ` בתאריך ${formattedDate}` : '';
    return this.buildLink(`שלום, אני רוצה לשמור מקום להרצאה: ${title}${dateSuffix}`);
  }

  /**
   * Booking enquiry for a date-flexible (on-demand) lecture — includes the
   * lecture title and minimum participant requirement, and asks about an
   * available date.
   */
  buildOnDemandLectureLink(title: string, minimumParticipants: number | null): string | null {
    const minSuffix =
      minimumParticipants != null ? ` (מינימום ${minimumParticipants} משתתפים)` : '';
    return this.buildLink(
      `שלום, אני מעוניין/ת להזמין את ההרצאה: ${title}${minSuffix}. מה התאריכים הפנויים?`,
    );
  }
}
