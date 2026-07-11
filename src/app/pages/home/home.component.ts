import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SeoService } from '../../core/services/seo.service';
import { CtaFormComponent } from '../../shared/cta-form/cta-form.component';

interface ExpertiseCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, CtaFormComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);

  aboutImageUrl = signal<string>('/assets/about.png');

  expertiseCards: ExpertiseCard[] = [
    { icon: '/assets/icons/meditation.svg', title: 'מדיטציה',         description: 'הנחייה אישית לעומק הנשימה ושקט הנפש' },
    { icon: '/assets/icons/healing.svg',   title: 'ריפוי רגשי',       description: 'ליווי בתהליכי שחרור, ריפוי ובנייה מחדש' },
    { icon: '/assets/icons/coaching.svg',  title: 'ליווי אישי',        description: 'תמיכה צמודה בהתפתחות אישית ורוחנית' },
    { icon: '/assets/icons/lectures.svg',  title: 'הרצאות וסדנאות',   description: 'מפגשים קבוצתיים מעשירים ומעצימים' },
  ];

  ngOnInit() {
    this.seo.updateMeta({ title: 'עינת שומונוב', description: 'ריפוי, מדיטציה ושלווה פנימית' });
  }
}