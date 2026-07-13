import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Expressive "aurora glass" container — a frosted, translucent panel floating
 * over a slow, living aurora of the brand hues. A modern, premium wrapper
 * suited to blog cards and feature sections.
 *
 * Purely presentational content-projection wrapper. Place any content inside.
 *
 * @example
 * <app-glass-panel>
 *   <h3>כותרת פוסט</h3>
 *   <p>תקציר…</p>
 *   <a class="btn btn--primary" href="…">קריאה</a>
 * </app-glass-panel>
 */
@Component({
  selector: 'app-glass-panel',
  standalone: true,
  imports: [],
  template: `<div class="content"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './glass-panel.component.scss',
})
export class GlassPanelComponent {}
