import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAX_RATE } from '../models/global.model';

export enum StarRatingMode {
  READONLY = 0,
  EDITABLE = 1,
}

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule, NgFor, NgClass],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  starRatingMode = StarRatingMode;

  @Input() mode = StarRatingMode.READONLY;
  @Input() rate = 0;
  @Input() max = MAX_RATE;
  @Output() ratingChange = new EventEmitter<number>();

  setRating(star: number) {
    this.rate = star;
    this.ratingChange.emit(this.rate);
  }
}
