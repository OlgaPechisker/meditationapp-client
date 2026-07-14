import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private phoneNumber = '972501234567';

  buildLink(message: string): string {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  buildTreatmentLink(treatmentTitle: string): string {
    return this.buildLink(`שלום, אני מתעניין/ת בטיפול: ${treatmentTitle}`);
  }

  /**
   * Registration enquiry for a scheduled lecture — includes the lecture title
   * and the formatted event date.
   */
  buildScheduledLectureLink(title: string, formattedDate: string): string {
    const dateSuffix = formattedDate ? ` בתאריך ${formattedDate}` : '';
    return this.buildLink(`שלום, אני רוצה לשמור מקום להרצאה: ${title}${dateSuffix}`);
  }

  /**
   * Booking enquiry for a date-flexible (on-demand) lecture — includes the
   * lecture title and minimum participant requirement, and asks about an
   * available date.
   */
  buildOnDemandLectureLink(title: string, minimumParticipants: number | null): string {
    const minSuffix =
      minimumParticipants != null ? ` (מינימום ${minimumParticipants} משתתפים)` : '';
    return this.buildLink(
      `שלום, אני מעוניין/ת להזמין את ההרצאה: ${title}${minSuffix}. מה התאריכים הפנויים?`,
    );
  }
}
