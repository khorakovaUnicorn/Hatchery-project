import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorFormLegalEntityComponent } from './calculator-form-legal-entity.component';

describe('CalculatorFormLegalEntityComponent', () => {
  let component: CalculatorFormLegalEntityComponent;
  let fixture: ComponentFixture<CalculatorFormLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorFormLegalEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
