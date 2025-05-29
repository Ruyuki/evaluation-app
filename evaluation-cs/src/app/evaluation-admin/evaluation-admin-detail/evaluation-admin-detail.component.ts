import {
  AsyncPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EvaluationDetailComponent } from '../../shared/components/evaluation-detail/evaluation-detail.component';
import {
  Answer,
  Evaluation,
  EvaluationStatus,
} from '../../shared/models/evaluation.model';
import { EvaluationService } from '../../shared/services/evaluation.service';

@Component({
  selector: 'app-evaluation-admin-detail',
  standalone: true,
  imports: [
    EvaluationDetailComponent,
    AsyncPipe,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInput,
    MatSelectModule,
    FormsModule,
    NgIf,
    NgFor,
    LowerCasePipe,
    KeyValuePipe,
  ],
  templateUrl: './evaluation-admin-detail.component.html',
})
export class EvaluationAdminDetailComponent {
  evaluationStatus = EvaluationStatus;

  evaluation$: Observable<Evaluation>;

  evaluationDetailForm: FormGroup;

  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.evaluation$ = this.evaluationService.getEvaluationById(id);

    this.evaluationDetailForm = this.formBuilder.group({
      comment: [null, [Validators.required, Validators.maxLength(4000)]],
    });
  }

  get comment() {
    return this.evaluationDetailForm.get('comment');
  }

  /**
   * Updates the status of an evaluation by sending the new status to the evaluation service.
   *
   * @param evaluationId - The unique identifier of the evaluation to update.
   * @param $event - The selection change event containing the new status value.
   */
  changeStatus(evaluationId: number, $event: MatSelectChange) {
    this.evaluationService
      .putEvaluationStatus(evaluationId, $event.value)
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error updating evaluation status:', error);
        },
      });
  }

  /**
   * Submits an answer for a specific evaluation.
   *
   * Sends the provided answer to the backend using the evaluation service.
   * On success, refreshes the evaluation data and resets the form.
   *
   * @param evaluationId - The unique identifier of the evaluation.
   * @param answer - The answer object to be submitted.
   * @param formDirective - The form directive used to reset the form state.
   */
  submitAnswer(
    evaluationId: number,
    answer: Answer,
    formDirective: FormGroupDirective,
  ): void {
    this.evaluationService.postAnswer(evaluationId, answer).subscribe({
      next: () => {
        this.evaluation$ =
          this.evaluationService.getEvaluationById(evaluationId);

        formDirective.resetForm();
        this.evaluationDetailForm.reset();
      },
      error: (error) => {
        console.error('Error submitting answer:', error);
      },
    });
  }
}
