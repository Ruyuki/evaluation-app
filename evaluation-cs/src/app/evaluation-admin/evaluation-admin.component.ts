import { Component, ViewChild } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import {
  Evaluation,
  EvaluationStatus,
  SearchEvaluationDTO,
} from '../shared/models/evaluation.model';
import { EvaluationService } from '../shared/services/evaluation.service';
import {
  StarRatingComponent,
  StarRatingMode,
} from '../shared/star-rating/star-rating.component';
import {
  DATE_FORMAT,
  DATE_HOUR_FORMAT,
  MAX_RATE,
  MIN_RATE,
} from '../shared/models/global.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { KeyValuePipe, LowerCasePipe, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evaluation-admin',
  standalone: true,
  imports: [
    RouterLink,
    MatPaginatorModule,
    MatTableModule,
    MatSort,
    TranslateModule,
    MatButtonModule,
    MatIcon,
    MatInput,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    StarRatingComponent,
    MatSortHeader,
    MatSelectModule,
    MatSliderModule,
    NgFor,
    LowerCasePipe,
    KeyValuePipe,
  ],
  templateUrl: './evaluation-admin.component.html',
  styleUrl: './evaluation-admin.component.scss',
})
export class EvaluationAdminComponent {
  starRatingMode = StarRatingMode;
  evaluationStatus = EvaluationStatus;
  dateFormat = DATE_FORMAT;
  dateHourFormat = DATE_HOUR_FORMAT;
  minRate = MIN_RATE;
  maxRate = MAX_RATE;

  private defaultSearchEvaluationDTO: SearchEvaluationDTO = {
    company: null,
    flightNumber: null,
    minRate: MIN_RATE,
    maxRate: MAX_RATE,
    status: null,
  };
  private defaultPageSize = 10;
  private defaultSortField = 'creationDate';
  private defaultSortDirection = 'DESC';

  displayedColumns: string[] = [
    'creationDate',
    'rate',
    'company',
    'flightNumber',
    'flightDate',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<Evaluation> =
    new MatTableDataSource<Evaluation>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;

  constructor(
    private evaluationService: EvaluationService,
    private formBuilder: FormBuilder,
  ) {
    this.searchForm = this.formBuilder.group({
      company: [this.defaultSearchEvaluationDTO.company],
      flightNumber: [null],
      minRate: [this.defaultSearchEvaluationDTO.minRate],
      maxRate: [this.defaultSearchEvaluationDTO.maxRate],
      status: [this.defaultSearchEvaluationDTO.status],
    });

    // Default search for evaluations (last 10 evaluations)
    this.searchEvaluations(
      this.defaultSearchEvaluationDTO,
      0,
      this.defaultPageSize,
      this.defaultSortField,
      this.defaultSortDirection,
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(searchEvaluationDTO: SearchEvaluationDTO): void {
    this.searchEvaluations(
      searchEvaluationDTO,
      0,
      this.defaultPageSize,
      this.defaultSortField,
      this.defaultSortDirection,
    );
  }

  resetFilter(): void {
    this.searchForm.reset(this.defaultSearchEvaluationDTO);
    this.applyFilter(this.defaultSearchEvaluationDTO);
  }

  onPageChange(
    searchEvaluationDTO: SearchEvaluationDTO,
    event: PageEvent,
  ): void {
    this.searchEvaluations(
      searchEvaluationDTO,
      event.pageIndex,
      event.pageSize,
      this.sort.active || this.defaultSortField,
      this.sort.direction || this.defaultSortDirection,
    );
  }

  onSortChange(searchEvaluationDTO: SearchEvaluationDTO, event: Sort): void {
    this.searchEvaluations(
      searchEvaluationDTO,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      event.active,
      event.direction,
    );
  }

  searchEvaluations(
    searchEvaluationDTO: SearchEvaluationDTO,
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
  ): void {
    searchEvaluationDTO = {
      ...searchEvaluationDTO,
      company: searchEvaluationDTO.company || null,
      flightNumber: searchEvaluationDTO.flightNumber || null,
      status: searchEvaluationDTO.status || null,
    };

    this.evaluationService
      .searchEvaluations(
        searchEvaluationDTO,
        page,
        pageSize,
        sortField,
        sortDirection,
      )
      .subscribe((evaluationsPaginated) => {
        this.dataSource = new MatTableDataSource(evaluationsPaginated.content);
        this.paginator.length = evaluationsPaginated.page.totalElements;
        this.paginator.pageIndex = evaluationsPaginated.page.number;
      });
  }
}
