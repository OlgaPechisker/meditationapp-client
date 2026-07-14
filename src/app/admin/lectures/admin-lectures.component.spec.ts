import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminLecturesComponent } from './admin-lectures.component';
import { ApiService } from '../../core/services/api.service';
import { Lecture } from '../../core/models/lecture.model';

describe('AdminLecturesComponent conditional fields', () => {
  let component: AdminLecturesComponent;
  let api: jasmine.SpyObj<ApiService>;

  function makeLecture(overrides: Partial<Lecture> = {}): Lecture {
    return {
      id: 1,
      slug: 'lecture',
      locale: 'he',
      type: 'SCHEDULED',
      title: 'הרצאה',
      subtitle: 'כותרת משנה',
      summary: 'תקציר',
      description: '<p>תיאור</p>',
      audience: 'קהל יעד',
      durationLabel: '90 דקות',
      highlights: ['נקודה'],
      date: '2099-01-01T10:00:00.000Z',
      location: 'תל אביב',
      price: 120,
      minimumParticipants: null,
      imageUrl: 'https://example.com/lecture.jpg',
      isActive: true,
      sortOrder: 3,
      ...overrides,
    };
  }

  function fillRequiredFields(): void {
    component.form.patchValue({
      title: 'הרצאה',
      subtitle: 'כותרת משנה',
      summary: 'תקציר',
      description: '<p>תיאור</p>',
      audience: 'קהל יעד',
      durationLabel: '90 דקות',
      location: 'תל אביב',
    });
    component.highlights.at(0).setValue('  נקודה מרכזית  ');
  }

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get', 'post', 'patch', 'delete']);
    api.get.and.returnValue(of({ data: [], meta: { page: 1, limit: 100, total: 0 } }));
    api.post.and.returnValue(of({}));
    api.patch.and.returnValue(of({}));
    api.delete.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [AdminLecturesComponent],
      providers: [{ provide: ApiService, useValue: api }],
    }).overrideComponent(AdminLecturesComponent, {
      set: { imports: [ReactiveFormsModule], template: '' },
    });

    const fixture = TestBed.createComponent(AdminLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requires a date for scheduled lectures and not a minimum', () => {
    component.openCreate();
    const { date, minimumParticipants } = component.form.controls;
    expect(date.valid).toBeFalse();
    minimumParticipants.setValue(null);
    expect(minimumParticipants.valid).toBeTrue();
  });

  it('clears the date and requires a minimum when switching to on-demand', () => {
    component.openCreate();
    component.form.controls.date.setValue('2099-01-01T10:00');
    component.form.controls.type.setValue('ON_DEMAND');

    expect(component.form.controls.date.value).toBe('');
    expect(component.form.controls.minimumParticipants.valid).toBeFalse();

    component.form.controls.minimumParticipants.setValue(5);
    expect(component.form.controls.minimumParticipants.valid).toBeTrue();
  });

  it('clears the minimum when switching back to scheduled', () => {
    component.openCreate();
    component.form.controls.type.setValue('ON_DEMAND');
    component.form.controls.minimumParticipants.setValue(8);
    component.form.controls.type.setValue('SCHEDULED');

    expect(component.form.controls.minimumParticipants.value).toBeNull();
  });

  it('keeps price optional for on-demand and required for scheduled', () => {
    component.openCreate();
    component.form.controls.price.setValue(null);
    expect(component.form.controls.price.valid).toBeFalse();

    component.form.controls.type.setValue('ON_DEMAND');
    component.form.controls.price.setValue(null);
    expect(component.form.controls.price.valid).toBeTrue();
  });

  it('manages the highlights list with at least one entry', () => {
    component.openCreate();
    expect(component.highlights.length).toBe(1);
    component.addHighlight();
    expect(component.highlights.length).toBe(2);
    component.removeHighlight(0);
    expect(component.highlights.length).toBe(1);
    component.removeHighlight(0);
    expect(component.highlights.length).toBe(1);
  });

  it('rejects whitespace-only highlights', () => {
    component.openCreate();
    fillRequiredFields();
    component.form.patchValue({ date: '2099-01-01T10:00', price: 120 });
    component.highlights.at(0).setValue('   ');

    expect(component.form.invalid).toBeTrue();

    component.save();

    expect(api.post).not.toHaveBeenCalled();
    expect(api.patch).not.toHaveBeenCalled();
  });

  it('posts the scheduled payload with an ISO date and create-only locale', () => {
    component.openCreate();
    fillRequiredFields();
    component.form.patchValue({
      date: '2099-01-01T10:00',
      price: 120,
      sortOrder: 3,
      imageUrl: '',
    });

    component.save();

    expect(api.post).toHaveBeenCalledOnceWith('/lectures', {
      type: 'SCHEDULED',
      title: 'הרצאה',
      subtitle: 'כותרת משנה',
      summary: 'תקציר',
      description: '<p>תיאור</p>',
      audience: 'קהל יעד',
      durationLabel: '90 דקות',
      location: 'תל אביב',
      highlights: ['נקודה מרכזית'],
      sortOrder: 3,
      isActive: true,
      price: 120,
      date: new Date('2099-01-01T10:00').toISOString(),
      minimumParticipants: null,
      locale: 'he',
    });
    expect(api.patch).not.toHaveBeenCalled();
  });

  it('posts the on-demand payload with conditional nulls', () => {
    component.openCreate();
    component.form.controls.type.setValue('ON_DEMAND');
    fillRequiredFields();
    component.form.patchValue({
      minimumParticipants: 6,
      price: null,
      imageUrl: 'https://example.com/new.jpg',
    });

    component.save();

    expect(api.post).toHaveBeenCalledOnceWith('/lectures', {
      type: 'ON_DEMAND',
      title: 'הרצאה',
      subtitle: 'כותרת משנה',
      summary: 'תקציר',
      description: '<p>תיאור</p>',
      audience: 'קהל יעד',
      durationLabel: '90 דקות',
      location: 'תל אביב',
      highlights: ['נקודה מרכזית'],
      sortOrder: 0,
      isActive: true,
      price: null,
      date: null,
      minimumParticipants: 6,
      imageUrl: 'https://example.com/new.jpg',
      locale: 'he',
    });
  });

  it('patches edits without locale and persists image removal', () => {
    const lecture = makeLecture();
    component.openEdit(lecture);
    component.form.controls.type.setValue('ON_DEMAND');
    component.form.controls.minimumParticipants.setValue(8);
    component.onImageUrlChange(null);

    component.save();

    expect(api.patch).toHaveBeenCalledOnceWith('/lectures/1', {
      type: 'ON_DEMAND',
      title: 'הרצאה',
      subtitle: 'כותרת משנה',
      summary: 'תקציר',
      description: '<p>תיאור</p>',
      audience: 'קהל יעד',
      durationLabel: '90 דקות',
      location: 'תל אביב',
      highlights: ['נקודה'],
      sortOrder: 3,
      isActive: true,
      price: 120,
      date: null,
      minimumParticipants: 8,
      imageUrl: null,
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it('deletes the selected lecture', () => {
    component.deleteItem(makeLecture({ id: 42 }));

    expect(api.delete).toHaveBeenCalledOnceWith('/lectures/42');
  });
});
