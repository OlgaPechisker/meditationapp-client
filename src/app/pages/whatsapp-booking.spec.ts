import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { of, Subject } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { SeoService } from '../core/services/seo.service';
import { Lecture } from '../core/models/lecture.model';
import { LectureDetailComponent } from './lectures/lecture-detail.component';
import { TreatmentDetailComponent } from './treatments/treatment-detail.component';
import { TreatmentListComponent } from './treatments/treatment-list.component';

class StubTranslocoLoader implements TranslocoLoader {
  getTranslation() {
    return of({});
  }
}

describe('WhatsApp booking pages', () => {
  let phoneResponse: Subject<{ value: string }>;
  let api: { get: jasmine.Spy };

  beforeEach(() => {
    phoneResponse = new Subject<{ value: string }>();
    api = { get: jasmine.createSpy('get').and.callFake((path: string) => {
      if (path === '/content/contact_phone') return phoneResponse.asObservable();
      if (path === '/treatments') {
        return of({ data: [], meta: { page: 1, limit: 100, total: 0 } });
      }
      if (path === '/treatments/example') {
        return of({
          id: 1, slug: 'example', title: 'Healing', description: 'A treatment',
          price: 100, imageUrl: '', isActive: true, locale: 'he', sortOrder: 0,
        });
      }
      if (path === '/lectures/example') {
        return of({
          id: 1, slug: 'example', locale: 'he', type: 'ON_DEMAND', title: 'Stillness',
          subtitle: null, summary: null, description: 'A lecture', audience: null,
          durationLabel: null, highlights: [], date: null, location: null, price: null,
          minimumParticipants: 5, imageUrl: null, isActive: true, sortOrder: 0,
        } satisfies Lecture);
      }
      throw new Error(`Unexpected API request: ${path}`);
    }) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTransloco({
          config: { availableLangs: ['he'], defaultLang: 'he' },
          loader: StubTranslocoLoader,
        }),
        { provide: ActivatedRoute, useValue: {
          paramMap: of(convertToParamMap({ slug: 'example' })),
          snapshot: {
            paramMap: convertToParamMap({ slug: 'example' }),
            queryParamMap: convertToParamMap({}),
          },
        } },
        { provide: ApiService, useValue: api },
        { provide: SeoService, useValue: jasmine.createSpyObj<SeoService>('SeoService', ['updateMeta']) },
      ],
    });
  });

  it('shows the treatment-list booking link only after loading the saved number', () => {
    const fixture = TestBed.createComponent(TreatmentListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a.cta-button')).toBeNull();

    phoneResponse.next({ value: '050-987 6543' });
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.cta-button');
    expect(link.getAttribute('href')).toContain('https://wa.me/972509876543?text=');
  });

  it('shows the treatment-detail booking link only after loading the saved number', () => {
    const fixture = TestBed.createComponent(TreatmentDetailComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a.cta-button')).toBeNull();

    phoneResponse.next({ value: '050-987 6543' });
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.cta-button');
    expect(link.getAttribute('href')).toContain('https://wa.me/972509876543?text=');
    expect(decodeURIComponent(link.href)).toContain('Healing');
  });

  it('shows the lecture booking link only after loading the saved number', () => {
    const fixture = TestBed.createComponent(LectureDetailComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="lecture-cta"]')).toBeNull();

    phoneResponse.next({ value: '050-987 6543' });
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('[data-testid="lecture-cta"]');
    expect(link.getAttribute('href')).toContain('https://wa.me/972509876543?text=');
    expect(decodeURIComponent(link.href)).toContain('Stillness');
  });
});
