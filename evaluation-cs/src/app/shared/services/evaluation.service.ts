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

  /**
   * Retrieves a list of public evaluations from the API.
   *
   * @returns An Observable that emits an array of `Evaluation` objects, each mapped from the API response.
   */
  getPublicEvaluations(): Observable<Evaluation[]> {
    return this.evaluationApiService.getPublicEvaluations().pipe(
      map((evaluations) => {
        return evaluations.map((evaluation) => {
          return this.mapToEvaluation(evaluation);
        });
      }),
    );
  }

  /**
   * Maps an `EvaluationApi` object to an `Evaluation` domain model.
   *
   * @param evaluation - The API evaluation object to map.
   * @returns The mapped `Evaluation` object with proper date and answers formatting.
   */
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

  /**
   * Maps an `AnswerAPI` object to an `Answer` domain model.
   *
   * @param answer - The API response object representing an answer.
   * @returns An `Answer` object with the `creationDate` property as a Moment.js instance.
   */
  private mapToEvaluationAnswer(answer: AnswerAPI): Answer {
    return {
      ...answer,
      creationDate: moment(answer.creationDate),
    };
  }

  /**
   * Submits an evaluation to the backend API.
   *
   * @param evaluation - The evaluation object to be posted.
   * @returns An Observable that completes when the evaluation has been successfully posted.
   */
  postEvaluation(evaluation: Evaluation): Observable<void> {
    return this.evaluationApiService.postEvaluation(
      this.mapToEvaluationApi(evaluation),
    );
  }

  /**
   * Maps an `Evaluation` domain model to an `EvaluationApi` object suitable for API communication.
   *
   * @param evaluation - The `Evaluation` object to be mapped.
   * @returns The mapped `EvaluationApi` object.
   */
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

  /**
   * Maps an `Answer` object to the API format for evaluation answers.
   *
   * @param answer - The `Answer` object to be mapped.
   * @returns An object formatted for the evaluation answer API.
   */
  private mapToEvaluationAnswerApi(answer: Answer): any {
    return {
      ...answer,
      creationDate: answer.creationDate
        ? answer.creationDate.toISOString()
        : null,
    };
  }

  /**
   * Retrieves an evaluation by its unique identifier.
   *
   * @param id - The unique identifier of the evaluation to retrieve.
   * @returns An Observable that emits the mapped `Evaluation` object.
   */
  getEvaluationById(id: number): Observable<Evaluation> {
    return this.evaluationApiService.getEvaluationById(id).pipe(
      map((evaluation) => {
        return this.mapToEvaluation(evaluation);
      }),
    );
  }

  /**
   * Updates the status of a specific evaluation.
   *
   * @param evaluationId - The unique identifier of the evaluation to update.
   * @param newStatus - The new status to set for the evaluation.
   * @returns An Observable that completes when the status update is successful.
   */
  putEvaluationStatus(
    evaluationId: number,
    newStatus: EvaluationStatus,
  ): Observable<void> {
    return this.evaluationApiService.putEvaluationStatus(
      evaluationId,
      newStatus,
    );
  }

  /**
   * Submits an answer for a specific evaluation.
   *
   * @param evaluationId - The unique identifier of the evaluation.
   * @param answer - The answer object to be submitted.
   * @returns An Observable that completes when the answer has been successfully posted.
   */
  postAnswer(evaluationId: number, answer: Answer): Observable<void> {
    return this.evaluationApiService.postAnswer(
      evaluationId,
      this.mapToEvaluationAnswerApi(answer),
    );
  }

  /**
   * Searches for evaluations based on the provided criteria and returns a paginated result.
   *
   * @param searchEvaluationDTO - The data transfer object containing search criteria for evaluations.
   * @param page - The page number to retrieve (zero-based).
   * @param size - The number of evaluations per page.
   * @param sortField - The field by which to sort the results.
   * @param sortDirection - The direction of sorting ('asc' or 'desc').
   * @returns An Observable emitting a paginated list of evaluations, with each evaluation mapped to the appropriate model.
   */
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
