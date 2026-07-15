import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminBlogComponent } from './admin-blog.component';
import { ApiService } from '../../core/services/api.service';

describe('AdminBlogComponent payloads', () => {
  let component: AdminBlogComponent;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get', 'post', 'patch', 'delete']);
    api.get.and.returnValue(of({ data: [], meta: { page: 1, limit: 100, total: 0 } }));
    api.post.and.returnValue(of({}));
    api.patch.and.returnValue(of({}));
    api.delete.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [AdminBlogComponent],
      providers: [{ provide: ApiService, useValue: api }],
    }).overrideComponent(AdminBlogComponent, {
      set: { imports: [ReactiveFormsModule], template: '' },
    });

    const fixture = TestBed.createComponent(AdminBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('posts locale when creating a blog post', () => {
    component.openCreate();
    component.form.patchValue({
      slug: 'new-post',
      title: 'New post',
      content: '<p>Content</p>',
    });

    component.save();

    expect(api.post).toHaveBeenCalledOnceWith('/blog', jasmine.objectContaining({
      slug: 'new-post',
      locale: 'he',
    }));
  });

  it('does not patch locale when editing a blog post', () => {
    component.openEdit({
      id: '507',
      slug: 'existing-post',
      title: 'Existing post',
      excerpt: '',
      content: '<p>Content</p>',
    });

    component.save();

    expect(api.patch).toHaveBeenCalledOnceWith('/blog/507', jasmine.anything());
    expect(api.patch.calls.mostRecent().args[1]).not.toEqual(jasmine.objectContaining({
      locale: jasmine.anything(),
    }));
  });
});
