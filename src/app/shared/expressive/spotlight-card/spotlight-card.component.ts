import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Expressive "spotlight" container — a dramatic dark card wrapped by a slowly
 * orbiting conic-gradient light ring, with a soft glow that breathes behind the
 * content. The premium, hero-worthy wrapper for feature sections and primary
 * calls-to-action.
 *
 * Purely presentational content-projection wrapper. Its dark surface sets a
 * light base text color that cascades into projected content.
 *
 * @example
 * <app-spotlight-card>
 *   <h2>כותרת ראשית</h2>
 *   <p>טקסט…</p>
 *   <a class="btn btn--primary" href="…">קריאה לפעולה</a>
 * </app-spotlight-card>
 */
@Component({
  selector: 'app-spotlight-card',
  standalone: true,
  imports: [],
  template: `<div class="content"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './spotlight-card.component.scss',
})
export class SpotlightCardComponent {}
