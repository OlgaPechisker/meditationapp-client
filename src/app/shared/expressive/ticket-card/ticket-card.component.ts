import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Expressive "ticket" container — a coupon/ticket-style card with notched side
 * edges, a dashed inner perforation and a corner star. Playful but structured;
 * intended for the lectures page and offers / calls-to-action.
 *
 * Purely presentational content-projection wrapper. Place any content inside.
 *
 * @example
 * <app-ticket-card>
 *   <h3>הרצאה</h3>
 *   <p>פרטים…</p>
 * </app-ticket-card>
 */
@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [],
  template: `<div class="content"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ticket-card.component.scss',
})
export class TicketCardComponent {}
