import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorFormOsvcComponent } from './calculator-form-osvc.component';

describe('CalculatorFormOsvcComponent', () => {
  let component: CalculatorFormOsvcComponent;
  let fixture: ComponentFixture<CalculatorFormOsvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorFormOsvcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormOsvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
