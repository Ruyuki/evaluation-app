import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnswerAPI,
  EvaluationApi,
  EvaluationsPaginated,
  EvaluationStatus,
} from '../models/evaluation.model';
import { UserService } from '../../core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class EvaluationApiService {
  private apiUrl = 'http://localhost:8080/api/evaluation';
  private apiAdminUrl = 'http://localhost:8080/api/evaluation-admin';

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getPublicEvaluations(): Observable<EvaluationApi[]> {
    return this.http.get<EvaluationApi[]>(`${this.apiUrl}/public`, {
      responseType: 'json',
    });
  }

  postEvaluation(evaluation: EvaluationApi): Observable<void> {
    return this.http.post<void>(this.apiUrl, evaluation);
  }

  getEvaluationById(id: number): Observable<EvaluationApi> {
    return this.http.get<EvaluationApi>(`${this.apiAdminUrl}/${id}`, {
      headers: this.userService.getSecurityHeaders(),
      responseType: 'json',
    });
  }

  putEvaluationStatus(
    evaluationId: number,
    newStatus: EvaluationStatus,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiAdminUrl}/${evaluationId}/status`,
      newStatus,
      { headers: this.userService.getSecurityHeaders() },
    );
  }

  postAnswer(evaluationId: number, answer: AnswerAPI): Observable<void> {
    return this.http.post<void>(
      `${this.apiAdminUrl}/${evaluationId}/answer`,
      answer,
      { headers: this.userService.getSecurityHeaders() },
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
      `${this.apiAdminUrl}/search`,
      searchEvaluationDTO,
      {
        headers: this.userService.getSecurityHeaders(),
        params: params,
        responseType: 'json',
      },
    );
  }
}
