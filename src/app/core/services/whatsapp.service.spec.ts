import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let api: jasmine.SpyObj<ApiService>;
  let phoneResponse: Subject<{ value: string }>;

  beforeEach(() => {
    phoneResponse = new Subject<{ value: string }>();
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(phoneResponse.asObservable());
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: api }] });
    service = TestBed.inject(WhatsappService);
  });

  it('loads the admin contact phone and does not build links before it arrives', () => {
    expect(api.get).toHaveBeenCalledWith('/content/contact_phone', { locale: 'he' });
    expect(service.buildLink('hello')).toBeNull();

    phoneResponse.next({ value: '050-987 6543' });
    expect(service.phoneNumber()).toBe('972509876543');
    expect(service.buildLink('שלום')).toBe(`https://wa.me/972509876543?text=${encodeURIComponent('שלום')}`);
  });

  it('accepts an international number and refreshes after an admin update', () => {
    phoneResponse.next({ value: '+972 (50) 987-6543' });
    expect(service.phoneNumber()).toBe('972509876543');

    service.refresh();
    expect(service.buildLink('hello')).toBeNull();
    expect(api.get).toHaveBeenCalledTimes(2);
    phoneResponse.next({ value: '0541234567' });
    expect(service.phoneNumber()).toBe('972541234567');
  });

  it('does not produce a link if the saved phone is invalid or the request fails', () => {
    spyOn(console, 'error');
    phoneResponse.next({ value: 'not a number' });
    expect(service.error()).toBeTrue();
    expect(service.buildLink('hello')).toBeNull();

    service.refresh();
    phoneResponse.error(new Error('offline'));
    expect(service.error()).toBeTrue();
    expect(service.buildLink('hello')).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  describe('message links', () => {
    beforeEach(() => {
      phoneResponse.next({ value: '050-987 6543' });
    });

    it('builds a scheduled lecture link with title and date, URL-encoded', () => {
      const link = service.buildScheduledLectureLink('להקשיב פנימה', '19/08/2026')!;
      expect(link.startsWith('https://wa.me/972509876543?text=')).toBeTrue();
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('להקשיב פנימה');
      expect(decoded).toContain('19/08/2026');
    });

    it('omits the date phrase when no date is provided', () => {
      const link = service.buildScheduledLectureLink('כותרת', '')!;
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('כותרת');
      expect(decoded).not.toContain('בתאריך');
    });

    it('builds an on-demand link with title and minimum participants', () => {
      const link = service.buildOnDemandLectureLink('שקט בעבודה', 10)!;
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('שקט בעבודה');
      expect(decoded).toContain('10');
      expect(decoded).toContain('התאריכים הפנויים');
    });

    it('omits the minimum phrase when no minimum is provided', () => {
      const link = service.buildOnDemandLectureLink('כותרת', null)!;
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('כותרת');
      expect(decoded).not.toContain('מינימום');
    });

    it('URL-encodes spaces and Hebrew so the raw link has no literal spaces', () => {
      const link = service.buildOnDemandLectureLink('שתי מילים', 5)!;
      expect(link).not.toContain(' ');
    });
  });
});
