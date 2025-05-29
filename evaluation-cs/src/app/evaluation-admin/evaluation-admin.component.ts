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
  SearchEvaluationAPI,
} from '../shared/models/evaluation.model';
import { EvaluationService } from '../shared/services/evaluation.service';
import {
  StarRatingComponent,
  StarRatingMode,
} from '../shared/components/star-rating/star-rating.component';
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
})
export class EvaluationAdminComponent {
  starRatingMode = StarRatingMode;
  evaluationStatus = EvaluationStatus;
  dateFormat = DATE_FORMAT;
  dateHourFormat = DATE_HOUR_FORMAT;
  minRate = MIN_RATE;
  maxRate = MAX_RATE;

  private defaultSearchEvaluationAPI: SearchEvaluationAPI = {
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
      company: [this.defaultSearchEvaluationAPI.company],
      flightNumber: [null],
      minRate: [this.defaultSearchEvaluationAPI.minRate],
      maxRate: [this.defaultSearchEvaluationAPI.maxRate],
      status: [this.defaultSearchEvaluationAPI.status],
    });

    // Default search for evaluations (last 10 evaluations)
    this.searchEvaluations(
      this.defaultSearchEvaluationAPI,
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

  /**
   * Applies a filter to the evaluations list based on the provided search criteria.
   * Resets the pagination to the first page.
   *
   * @param searchEvaluationAPI - The data transfer object containing the search criteria for filtering evaluations.
   */
  applyFilter(searchEvaluationAPI: SearchEvaluationAPI): void {
    this.searchEvaluations(
      searchEvaluationAPI,
      0,
      this.defaultPageSize,
      this.defaultSortField,
      this.defaultSortDirection,
    );
  }

  /**
   * Resets the search form to its default values and reapplies the filter using the default search criteria.
   */
  resetFilter(): void {
    this.searchForm.reset(this.defaultSearchEvaluationAPI);
    this.applyFilter(this.defaultSearchEvaluationAPI);
  }

  /**
   * Handles the pagination event for the evaluation list.
   *
   * @param searchEvaluationAPI - The current search criteria for evaluations.
   * @param event - The pagination event containing the new page index and page size.
   */
  onPageChange(
    searchEvaluationAPI: SearchEvaluationAPI,
    event: PageEvent,
  ): void {
    this.searchEvaluations(
      searchEvaluationAPI,
      event.pageIndex,
      event.pageSize,
      this.sort.active || this.defaultSortField,
      this.sort.direction || this.defaultSortDirection,
    );
  }

  /**
   * Handles changes in the sorting of evaluation data.
   *
   * @param searchEvaluationAPI - The current search criteria for evaluations.
   * @param event - The sort event containing the active column and direction.
   */
  onSortChange(searchEvaluationAPI: SearchEvaluationAPI, event: Sort): void {
    this.searchEvaluations(
      searchEvaluationAPI,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      event.active,
      event.direction,
    );
  }

  /**
   * Searches for evaluations based on the provided criteria and updates the data source for the table.
   *
   * @param searchEvaluationAPI - The data transfer object containing search filters such as company, flight number, and status.
   * @param page - The current page number for pagination.
   * @param pageSize - The number of items to display per page.
   * @param sortField - The field by which to sort the results.
   * @param sortDirection - The direction of sorting ('asc' or 'desc').
   */
  searchEvaluations(
    searchEvaluationAPI: SearchEvaluationAPI,
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
  ): void {
    searchEvaluationAPI = {
      ...searchEvaluationAPI,
      company: searchEvaluationAPI.company || null,
      flightNumber: searchEvaluationAPI.flightNumber || null,
      status: searchEvaluationAPI.status || null,
    };

    this.evaluationService
      .searchEvaluations(
        searchEvaluationAPI,
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
