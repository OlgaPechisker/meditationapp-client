import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Expressive "sheen" container — a clean white card with an animated gradient
 * border and a diagonal light sweep that runs across on hover. The polished,
 * professional wrapper suited to blog cards and content tiles.
 *
 * Purely presentational content-projection wrapper. Place any content inside.
 *
 * @example
 * <app-sheen-card>
 *   <h3>כותרת</h3>
 *   <p>תקציר…</p>
 * </app-sheen-card>
 */
@Component({
  selector: 'app-sheen-card',
  standalone: true,
  imports: [],
  template: `<div class="content"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sheen-card.component.scss',
})
export class SheenCardComponent {}
