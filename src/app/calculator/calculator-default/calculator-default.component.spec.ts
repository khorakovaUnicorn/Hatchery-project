import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorDefaultComponent } from './calculator-default.component';

describe('CalculatorDefaultComponent', () => {
  let component: CalculatorDefaultComponent;
  let fixture: ComponentFixture<CalculatorDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
