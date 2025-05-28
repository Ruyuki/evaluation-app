import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EvaluationApiService } from './evaluation-api.service';
import moment from 'moment';
import {
  Evaluation,
  EvaluationApi,
  EvaluationsPaginated,
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
    };
  }

  getEvaluationById(id: string): Observable<Evaluation> {
    return this.evaluationApiService.getEvaluationById(id).pipe(
      map((evaluation) => {
        return this.mapToEvaluation(evaluation);
      }),
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
