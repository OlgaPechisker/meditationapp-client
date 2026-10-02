import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { AdminContentComponent } from './admin-content.component';

describe('AdminContentComponent contact save', () => {
  let component: AdminContentComponent;
  let api: jasmine.SpyObj<ApiService>;
  let whatsapp: jasmine.SpyObj<WhatsappService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['put']);
    whatsapp = jasmine.createSpyObj<WhatsappService>('WhatsappService', ['refresh']);
    TestBed.configureTestingModule({
      imports: [AdminContentComponent],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: WhatsappService, useValue: whatsapp },
      ],
    }).overrideComponent(AdminContentComponent, {
      set: { imports: [ReactiveFormsModule], template: '' },
    });
    component = TestBed.createComponent(AdminContentComponent).componentInstance;
    component.contactForm.setValue({ phone: '050-987 6543', email: 'test@example.com' });
  });

  it('refreshes the WhatsApp phone after saving contact information', () => {
    api.put.and.returnValue(of({}));
    component.saveContact();

    expect(api.put).toHaveBeenCalledWith('/content', {
      key: 'contact_phone', value: '050-987 6543', locale: 'he',
    });
    expect(whatsapp.refresh).toHaveBeenCalledTimes(1);
    expect(component.contactSaveState()).toBe('success');
  });

  it('does not refresh the WhatsApp phone if saving fails', () => {
    api.put.and.returnValue(throwError(() => new Error('offline')));
    component.saveContact();

    expect(whatsapp.refresh).not.toHaveBeenCalled();
    expect(component.contactSaveState()).toBe('error');
  });
});
