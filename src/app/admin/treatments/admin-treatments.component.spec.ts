import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminTreatmentsComponent } from './admin-treatments.component';
import { ApiService } from '../../core/services/api.service';

describe('AdminTreatmentsComponent payloads', () => {
  let component: AdminTreatmentsComponent;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get', 'post', 'patch', 'delete']);
    api.get.and.returnValue(of({ data: [], meta: { page: 1, limit: 100, total: 0 } }));
    api.post.and.returnValue(of({}));
    api.patch.and.returnValue(of({}));
    api.delete.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [AdminTreatmentsComponent],
      providers: [{ provide: ApiService, useValue: api }],
    }).overrideComponent(AdminTreatmentsComponent, {
      set: { imports: [ReactiveFormsModule], template: '' },
    });

    const fixture = TestBed.createComponent(AdminTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('posts locale when creating a treatment', () => {
    component.openCreate();
    component.form.patchValue({
      slug: 'healing',
      title: 'Healing',
      description: '<p>Healing treatment</p>',
    });

    component.save();

    expect(api.post).toHaveBeenCalledOnceWith('/treatments', jasmine.objectContaining({
      slug: 'healing',
      locale: 'he',
    }));
  });

  it('does not patch locale when editing a treatment', () => {
    component.openEdit({
      id: '507',
      slug: 'healing',
      title: 'Healing',
      description: '<p>Healing treatment</p>',
      price: 0,
      isActive: true,
    });

    component.save();

    expect(api.patch).toHaveBeenCalledOnceWith('/treatments/507', jasmine.anything());
    expect(api.patch.calls.mostRecent().args[1]).not.toEqual(jasmine.objectContaining({
      locale: jasmine.anything(),
    }));
  });
});
