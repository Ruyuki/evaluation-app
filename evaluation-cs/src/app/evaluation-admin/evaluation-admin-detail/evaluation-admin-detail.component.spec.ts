import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationAdminDetailComponent } from './evaluation-admin-detail.component';

describe('EvaluationAdminDetailComponent', () => {
  let component: EvaluationAdminDetailComponent;
  let fixture: ComponentFixture<EvaluationAdminDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationAdminDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationAdminDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
