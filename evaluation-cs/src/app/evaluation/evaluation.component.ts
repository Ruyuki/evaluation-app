import { Component } from '@angular/core';
import { EvaluationEditionComponent } from './evaluation-edition/evaluation-edition.component';
import { EvaluationListComponent } from './evaluation-list/evaluation-list.component';
import { EvaluationService } from '../shared/services/evaluation.service';
import { Observable } from 'rxjs';
import { Evaluation } from '../shared/models/evaluation.model';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    EvaluationEditionComponent,
    EvaluationListComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss',
})
export class EvaluationComponent {
  evaluations$!: Observable<Evaluation[]>;

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit() {
    this.evaluations$ = this.evaluationService.getPublicEvaluations();
  }
}
