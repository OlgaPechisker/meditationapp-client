import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

/**
 * Shared "Editorial Split" page hero (hero-B). A start-aligned magazine header:
 * an optional eyebrow, the page `<h1>` title, and an optional subtitle on one
 * side, with an optional actions slot (searchbar / legend / CTA) on the other,
 * anchored by a champagne→purple hairline underline.
 *
 * Content projection with named slots:
 * - default slot         → the page's `<h1>` title (one per page for a11y/SEO).
 * - `[hero-eyebrow]`      → optional small eyebrow line.
 * - `[hero-subtitle]`     → optional subtitle paragraph.
 * - `[hero-actions]`      → optional side widget.
 *
 * Uses `ViewEncapsulation.None` (every rule namespaced under `.page-hero`) so
 * projected eyebrow/title/subtitle content can be styled by this component.
 *
 * @example
 * <app-page-hero>
 *   <span hero-eyebrow>ריפוי ומדיטציה</span>
 *   <h1>טיפולים</h1>
 *   <p hero-subtitle>מרחב ריפוי, מדיטציה ושלווה פנימית</p>
 *   <a hero-actions class="btn" href="…">קביעת תור</a>
 * </app-page-hero>
 */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [],
  template: `
    <header class="page-hero"><div class="page-hero__inner">
      <div class="page-hero__text">
        <div class="page-hero__eyebrow"><ng-content select="[hero-eyebrow]" /></div>
        <div class="page-hero__title"><ng-content /></div>
        <div class="page-hero__subtitle"><ng-content select="[hero-subtitle]" /></div>
      </div>
      <div class="page-hero__actions"><ng-content select="[hero-actions]" /></div>
    </div></header>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './page-hero.component.scss',
})
export class PageHeroComponent {}
