import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Expressive "paper note" container — the signature ruled-paper card from the
 * treatments page, refined into a reusable, animated wrapper.
 *
 * Purely presentational: it projects whatever content you place inside it and
 * lays projected children out in a comfortable vertical rhythm. Intended for
 * text / editorial content (headings, paragraphs, quotes) — avoid action
 * buttons inside a "note", which feels out of place.
 *
 * @example
 * <app-paper-note>
 *   <h2>כותרת</h2>
 *   <p>תוכן טקסטואלי…</p>
 * </app-paper-note>
 */
@Component({
  selector: 'app-paper-note',
  standalone: true,
  imports: [],
  template: `
    <svg class="doodle doodle--sparkle" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
    <svg class="doodle doodle--swirl" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M61 20c-20-13-46 7-31 26 10 13 32 2 24-10-6-8-19-2-14 6" />
    </svg>
    <div class="content"><ng-content /></div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './paper-note.component.scss',
})
export class PaperNoteComponent {}
