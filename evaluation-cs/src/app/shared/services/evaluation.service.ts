import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EvaluationApiService } from './evaluation-api.service';
import moment from 'moment';
import {
  Answer,
  AnswerAPI,
  Evaluation,
  EvaluationApi,
  EvaluationsPaginated,
  EvaluationStatus,
} from '../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  constructor(private evaluationApiService: EvaluationApiService) {}

  getPublicEvaluations(): Observable<Evaluation[]> {
    return this.evaluationApiService.getPublicEvaluations().pipe(
      map((evaluations) => {
        return evaluations.map((evaluation) => {
          return this.mapToEvaluation(evaluation);
        });
      }),
    );
  }

  private mapToEvaluation(evaluation: EvaluationApi): Evaluation {
    return {
      ...evaluation,
      flightDate: moment(evaluation.flightDate),
      creationDate: moment(evaluation.creationDate),
      answers: evaluation.answers
        ? evaluation.answers.map((answer) => this.mapToEvaluationAnswer(answer))
        : [],
    };
  }

  private mapToEvaluationAnswer(answer: AnswerAPI): any {
    return {
      ...answer,
      creationDate: moment(answer.creationDate),
    };
  }

  postEvaluation(evaluation: Evaluation): Observable<void> {
    return this.evaluationApiService.postEvaluation(
      this.mapToEvaluationApi(evaluation),
    );
  }

  private mapToEvaluationApi(evaluation: Evaluation): EvaluationApi {
    return {
      ...evaluation,
      flightDate: evaluation.flightDate.toISOString(),
      creationDate: evaluation.creationDate
        ? evaluation.creationDate.toISOString()
        : null,
      answers: evaluation.answers
        ? evaluation.answers.map((answer) =>
            this.mapToEvaluationAnswerApi(answer),
          )
        : [],
    };
  }

  private mapToEvaluationAnswerApi(answer: Answer): any {
    return {
      ...answer,
      creationDate: answer.creationDate
        ? answer.creationDate.toISOString()
        : null,
    };
  }

  getEvaluationById(id: number): Observable<Evaluation> {
    return this.evaluationApiService.getEvaluationById(id).pipe(
      map((evaluation) => {
        return this.mapToEvaluation(evaluation);
      }),
    );
  }

  putEvaluationStatus(
    evaluationId: number,
    newStatus: EvaluationStatus,
  ): Observable<void> {
    return this.evaluationApiService.putEvaluationStatus(
      evaluationId,
      newStatus,
    );
  }

  postAnswer(evaluationId: number, answer: Answer): Observable<void> {
    return this.evaluationApiService.postAnswer(
      evaluationId,
      this.mapToEvaluationAnswerApi(answer),
    );
  }

  searchEvaluations(
    searchEvaluationDTO: any,
    page: number,
    size: number,
    sortField: string,
    sortDirection: string,
  ): Observable<EvaluationsPaginated<Evaluation[]>> {
    return this.evaluationApiService
      .searchEvaluations(
        searchEvaluationDTO,
        page,
        size,
        sortField,
        sortDirection,
      )
      .pipe(
        map((evaluationsPaginated) => {
          return {
            ...evaluationsPaginated,
            content: evaluationsPaginated.content.map((evaluation) =>
              this.mapToEvaluation(evaluation),
            ),
          };
        }),
      );
  }
}
