import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  StarRatingComponent,
  StarRatingMode,
} from '../../shared/components/star-rating/star-rating.component';
import { Evaluation } from '../../shared/models/evaluation.model';
import { EvaluationService } from '../../shared/services/evaluation.service';
import moment from 'moment';

@Component({
  selector: 'app-evaluation-edition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    NgIf,
    MatDatepickerModule,
    MatButton,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    StarRatingComponent,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './evaluation-edition.component.html',
})
export class EvaluationEditionComponent {
  maxFlightDate = new Date();
  starRatingMode = StarRatingMode;

  evaluationForm: FormGroup;

  constructor(
    private evaluationService: EvaluationService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
  ) {
    this.evaluationForm = this.formBuilder.group({
      company: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      flightNumber: [null, [Validators.required, Validators.maxLength(4)]],
      flightDate: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      comment: [null, [Validators.required, Validators.maxLength(4000)]],
    });
  }

  get company() {
    return this.evaluationForm.get('company');
  }
  get flightNumber() {
    return this.evaluationForm.get('flightNumber');
  }
  get flightDate() {
    return this.evaluationForm.get('flightDate');
  }
  get rate() {
    return this.evaluationForm.get('rate');
  }
  get comment() {
    return this.evaluationForm.get('comment');
  }

  /**
   * Submits the provided evaluation data.
   *
   * On successful submission, the evaluation form and the form directive are reset.
   *
   * @param evaluation - The evaluation data to be submitted.
   * @param formDirective - The form directive associated with the evaluation form, used for resetting the form state.
   */
  submitEvaluation(
    evaluation: Evaluation,
    formDirective: FormGroupDirective,
  ): void {
    this.evaluationService.postEvaluation(evaluation).subscribe({
      next: () => {
        this.evaluationForm.reset();
        formDirective.resetForm();
      },
      error: (err) => {
        console.error('Error submitting evaluation:', err);
      },
    });
  }

  getRateTooltip(): string | undefined {
    return this.rate?.hasError('required')
      ? this.translateService.instant('evaluation.evaluate-flight.errors.rate')
      : undefined;
  }
}
