import moment, { Moment } from 'moment';

export enum EvaluationStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
}

export interface EvaluationApi {
  id: number;
  company: string;
  flightNumber: string;
  flightDate: string;
  rate: number;
  comment: string;
  status: string;
  creationDate: string | null;
  answers?: AnswerAPI[];
}

export interface AnswerAPI {
  creationDate: string | null;
  comment: string;
}

export interface Evaluation {
  id: number;
  company: string;
  flightNumber: string;
  flightDate: Moment;
  rate: number;
  comment: string;
  status: string;
  creationDate: Moment;
  answers?: Answer[];
}

export interface Answer {
  creationDate: Moment;
  comment: string;
}

export interface SearchEvaluationDTO {
  company: string | null;
  flightNumber: string | null;
  minRate: number | null;
  maxRate: number | null;
  status: string | null;
}

export interface EvaluationsPaginated<T> {
  content: T;
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
