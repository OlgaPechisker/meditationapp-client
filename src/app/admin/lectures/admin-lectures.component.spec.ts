import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminLecturesComponent } from './admin-lectures.component';
import { ApiService } from '../../core/services/api.service';

describe('AdminLecturesComponent conditional fields', () => {
  let component: AdminLecturesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminLecturesComponent],
      providers: [{ provide: ApiService, useValue: { get: () => of({ data: [], meta: {} }) } }],
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
});
