import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { CtaFormComponent } from './cta-form.component';

describe('CtaFormComponent WhatsApp availability', () => {
  it('disables sending until a number is available and does not claim an unavailable message was sent', () => {
    const phoneNumber = signal<string | null>(null);
    const whatsapp = {
      phoneNumber,
      error: signal(false),
      buildLink: jasmine.createSpy('buildLink').and.returnValue(null),
    };
    TestBed.configureTestingModule({
      imports: [CtaFormComponent],
      providers: [{ provide: WhatsappService, useValue: whatsapp }],
    });

    const fixture = TestBed.createComponent(CtaFormComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    phoneNumber.set('972509876543');
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();

    fixture.componentInstance.contactForm.setValue({
      name: 'Test', phone: '0501234567', email: 'test@example.com', message: '',
    });
    fixture.componentInstance.submitForm();
    expect(fixture.componentInstance.submitted()).toBeFalse();
    expect(whatsapp.buildLink).toHaveBeenCalled();
  });
});
