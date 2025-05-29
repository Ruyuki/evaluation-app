import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../shared/models/evaluation.model';
import { EvaluationService } from '../shared/services/evaluation.service';
import { EvaluationDetailComponent } from '../shared/components/evaluation-detail/evaluation-detail.component';
import { EvaluationEditionComponent } from './evaluation-edition/evaluation-edition.component';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    EvaluationEditionComponent,
    EvaluationDetailComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './evaluation.component.html',
})
export class EvaluationComponent {
  evaluations$!: Observable<Evaluation[]>;

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit() {
    this.evaluations$ = this.evaluationService.getPublicEvaluations();
  }
}
