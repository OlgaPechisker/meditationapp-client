import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-cta-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cta-form.component.html',
  styleUrl: './cta-form.component.scss',
})
export class CtaFormComponent {
  private whatsapp = inject(WhatsappService);
  private fb = inject(FormBuilder);

  /** Prefix for input ids/labels so they stay unique when the form appears on multiple pages. */
  idPrefix = input('cta');

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  submitted = signal(false);

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
