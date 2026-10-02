import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let phoneResponse: Subject<{ value: string }>;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    phoneResponse = new Subject<{ value: string }>();
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(phoneResponse.asObservable());
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: ApiService, useValue: api }],
    }).compileComponents();
  });

  it('links to the saved contact phone after it loads', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();

    phoneResponse.next({ value: '050-987 6543' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('https://wa.me/972509876543');
  });

  it('shows an unavailable message instead of a broken link on load failure', () => {
    spyOn(console, 'error');
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    phoneResponse.error(new Error('offline'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('אינו זמין');
  });
});
