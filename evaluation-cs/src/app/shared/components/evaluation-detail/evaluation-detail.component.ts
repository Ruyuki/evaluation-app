import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Evaluation } from '../../models/evaluation.model';
import { DATE_FORMAT, DATE_HOUR_FORMAT } from '../../models/global.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-evaluation-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatDivider,
    StarRatingComponent,
    TranslateModule,
    MatIcon,
  ],
  templateUrl: './evaluation-detail.component.html',
})
export class EvaluationDetailComponent {
  dateFormat = DATE_FORMAT;
  dateHourFormat = DATE_HOUR_FORMAT;

  @Input()
  evaluation: Evaluation | null = null;
}
