import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorFormIndividualComponent } from './calculator-form-individual.component';

describe('CalculatorFormIndividualComponent', () => {
  let component: CalculatorFormIndividualComponent;
  let fixture: ComponentFixture<CalculatorFormIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorFormIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
