import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationAdminComponent } from './evaluation-admin.component';

describe('EvaluationAdminComponent', () => {
  let component: EvaluationAdminComponent;
  let fixture: ComponentFixture<EvaluationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
