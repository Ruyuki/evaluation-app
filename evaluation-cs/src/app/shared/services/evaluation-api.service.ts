import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnswerAPI,
  EvaluationApi,
  EvaluationsPaginated,
  EvaluationStatus,
} from '../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationApiService {
  private apiUrl = 'http://localhost:8080/api/evaluation';

  constructor(private http: HttpClient) {}

  getPublicEvaluations(): Observable<EvaluationApi[]> {
    return this.http.get<EvaluationApi[]>(`${this.apiUrl}/public`, {
      responseType: 'json',
    });
  }

  postEvaluation(evaluation: EvaluationApi): Observable<void> {
    return this.http.post<void>(this.apiUrl, evaluation);
  }

  getEvaluationById(id: number): Observable<EvaluationApi> {
    return this.http.get<EvaluationApi>(`${this.apiUrl}/${id}`, {
      responseType: 'json',
    });
  }

  putEvaluationStatus(
    evaluationId: number,
    newStatus: EvaluationStatus,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${evaluationId}/status`,
      newStatus,
    );
  }

  postAnswer(evaluationId: number, answer: AnswerAPI): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${evaluationId}/answer`,
      answer,
    );
  }

  searchEvaluations(
    searchEvaluationDTO: any,
    page: number,
    size: number,
    sortField: string,
    sortDirection: string,
  ): Observable<EvaluationsPaginated<EvaluationApi[]>> {
    const params = {
      page: page,
      size: size,
      sortField: sortField,
      sortDirection: sortDirection,
    };

    return this.http.post<EvaluationsPaginated<EvaluationApi[]>>(
      `${this.apiUrl}/search`,
      searchEvaluationDTO,
      {
        params: params,
        responseType: 'json',
      },
    );
  }
}
