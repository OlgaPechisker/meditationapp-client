import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '../../core/services/seo.service';
import { WhatsappService } from '../../core/services/whatsapp.service';

interface ExpertiseCard {
  icon: SafeHtml;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  private whatsapp = inject(WhatsappService);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);

  aboutImageUrl = signal<string>('');
  expertiseCards: ExpertiseCard[];

  constructor() {
    const icon = (paths: string): SafeHtml =>
      this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">${paths}</svg>`
      );

    this.expertiseCards = [
      {
        // Sparkles — meditation / inner light
        icon: icon(`
          <path stroke="#7B5EA7" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          <path stroke="#D4A5B5" d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>
        `),
        title: 'מדיטציה',
        description: 'הנחייה אישית לעומק הנשימה ושקט הנפש',
      },
      {
        // Heart — emotional healing; blush fill mirrors the logo's rose
        icon: icon(`
          <path stroke="#7B5EA7" fill="rgba(212,165,181,0.25)"
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        `),
        title: 'ריפוי רגשי',
        description: 'ליווי בתהליכי שחרור, ריפוי ובנייה מחדש',
      },
      {
        // Compass — personal coaching / direction
        icon: icon(`
          <circle stroke="#7B5EA7" cx="12" cy="12" r="10"/>
          <polygon stroke="#7B5EA7" fill="rgba(212,165,181,0.3)"
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        `),
        title: 'ליווי אישי',
        description: 'תמיכה צמודה בהתפתחות אישית ורוחנית',
      },
      {
        // Microphone — lectures & workshops
        icon: icon(`
          <path stroke="#7B5EA7" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path stroke="#7B5EA7" d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line stroke="#D4A5B5" x1="12" x2="12" y1="19" y2="22"/>
          <line stroke="#D4A5B5" x1="8" x2="16" y1="22" y2="22"/>
        `),
        title: 'הרצאות וסדנאות',
        description: 'מפגשים קבוצתיים מעשירים ומעצימים',
      },
    ];
  }

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  submitted = signal(false);

  ngOnInit() {
    this.seo.updateMeta({ title: 'עינת שומונוב', description: 'ריפוי, מדיטציה ושלווה פנימית' });
  }

  submitForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const { name, phone, email, message } = this.contactForm.value;
    const text = `שלום, שמי ${name}.\nטלפון: ${phone}\nאימייל: ${email}${message ? '\n' + message : ''}`;
    window.open(this.whatsapp.buildLink(text), '_blank');
    this.submitted.set(true);
    this.contactForm.reset();
  }
}
