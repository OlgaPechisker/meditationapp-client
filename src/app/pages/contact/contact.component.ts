import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslocoPipe, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private whatsapp = inject(WhatsappService);
  private seo = inject(SeoService);
  private fb = inject(FormBuilder);

  email = 'einat@example.com';
  phone = '050-1234567';

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  submitted = signal(false);

  ngOnInit() {
    this.seo.updateMeta({ title: 'צור קשר', description: 'יצירת קשר עם עינת שומונוב' });
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
