import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  standalone: true,
  template: '<div class="rich-content" [innerHTML]="content"></div>',
})
class RichContentHostComponent {
  content = '';
}

describe('rich-content rendering', () => {
  it('preserves the canonical formatting classes and safe link attributes', async () => {
    await TestBed.configureTestingModule({
      imports: [RichContentHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RichContentHostComponent);
    fixture.componentInstance.content =
      '<p class="ql-align-left ql-direction-ltr"><a href="https://example.com" target="_blank" rel="noopener noreferrer">Safe link</a></p>';
    fixture.detectChanges();

    const paragraph = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(paragraph.classList.contains('ql-align-left')).toBeTrue();
    expect(paragraph.classList.contains('ql-direction-ltr')).toBeTrue();
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('removes unsupported markup and attributes', async () => {
    await TestBed.configureTestingModule({
      imports: [RichContentHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RichContentHostComponent);
    fixture.componentInstance.content =
      '<p class="ql-align-left unsupported" style="color:red" data-source="editor">Safe</p><script>alert(1)</script>';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('.rich-content') as HTMLElement;
    expect(host.querySelector('script')).toBeNull();
    expect(host.textContent).toContain('Safe');
    expect(host.innerHTML).not.toContain('alert(1)');
    expect(host.innerHTML).not.toContain('style=');
    expect(host.innerHTML).not.toContain('data-source');
  });
});
