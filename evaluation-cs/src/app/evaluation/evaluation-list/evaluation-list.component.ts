import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Evaluation } from '../../shared/models/evaluation.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { TranslateModule } from '@ngx-translate/core';
import { DATE_FORMAT } from '../../shared/models/global.model';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [MatCardModule, StarRatingComponent, TranslateModule],
  templateUrl: './evaluation-list.component.html',
  styleUrl: './evaluation-list.component.scss',
})
export class EvaluationListComponent {
  dateFormat = DATE_FORMAT;

  @Input()
  evaluations: Evaluation[] = [];
}
