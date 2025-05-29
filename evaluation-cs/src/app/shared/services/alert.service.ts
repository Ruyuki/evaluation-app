import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBar = inject(MatSnackBar);
  constructor(private translateService: TranslateService) {}

  /**
   * Displays a generic error message using a snackbar notification.
   */
  displayGenericError() {
    this.snackBar.open(
      this.translateService.instant('global.error'),
      this.translateService.instant('global.close'),
    );
  }
}
