import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { WhatsappService } from '../../core/services/whatsapp.service';

interface ExpertiseCard {
  icon: string;
  title: string;
  description: string;
  rotation: number;
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

  aboutImageUrl = signal<string>('');

  expertiseCards: ExpertiseCard[] = [
    { icon: '🧘', title: 'מדיטציה', description: 'הנחייה אישית לעומק הנשימה ושקט הנפש', rotation: -20 },
    { icon: '💜', title: 'ריפוי רגשי', description: 'ליווי בתהליכי שחרור, ריפוי ובנייה מחדש', rotation: -7 },
    { icon: '🌱', title: 'ליווי אישי', description: 'תמיכה צמודה בהתפתחות אישית ורוחנית', rotation: 7 },
    { icon: '🎤', title: 'הרצאות וסדנאות', description: 'מפגשים קבוצתיים מעשירים ומעצימים', rotation: 20 },
  ];

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
