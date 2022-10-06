import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ApplicantType} from "../calculator-form.component";
import {CalculatorService} from "../../calculator.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-calculator-form-individual',
  templateUrl: './calculator-form-individual.component.html',
  styleUrls: ['../calculator-form.component.css']
})
export class CalculatorFormIndividualComponent implements OnInit, OnDestroy {
  loanFormIndividual: FormGroup;
  resSub: Subscription;
  errAddress: boolean = false;
  errSub: Subscription;

  constructor(private httpClient: HttpClient,
              private calcService: CalculatorService) {
  }

  ngOnInit(): void {
    this.loanFormIndividual = new FormGroup({
      'applicantType': new FormControl(ApplicantType.INDIVIDUAL),
      'name': new FormControl(null, [Validators.required]),
      'surname': new FormControl(null, [Validators.required]),
      'birthNum': new FormControl(null,[Validators.pattern("[0-9]{2,6}-?[0-9]{2,10}\\/[0-9]{3,4}")]),
      'nationality': new FormControl("Česká republika"),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phone': new FormControl(null,[Validators.pattern("^[1-9]+[0-9]*$"), Validators.maxLength(9)]),
      'address': new FormGroup({
        'street': new FormControl(),
        'descNumber': new FormControl(null, [Validators.pattern("^[1-9]+[0-9]*$")]),
        'indicativeNumber': new FormControl(),
        'city': new FormControl(),
        'postalCode': new FormControl(null, [Validators.pattern("^[1-9]+[0-9]*$"), Validators.maxLength(5)])
      }),
    });

    this.resSub = this.calcService.requestResponse.subscribe(response => {
      this.errAddress = !!response.error;
    });

    this.errSub = this.calcService.errAddress.subscribe(resData => {
      this.errAddress = resData;
    });
  }

  onSubmit() {
    let rawValue = this.loanFormIndividual.getRawValue();

    this.calcService.getDataFromUser(
'INDIVIDUAL',
      rawValue.name,
      rawValue.surname,
      rawValue.birthNum,
      rawValue.nationality,
      rawValue.email,
      rawValue.phone,
      null,
      null,
      null,
      rawValue.address
    )
  }

  onAddressChange() {
    this.calcService.errAddress.next(false);
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
    this.errSub.unsubscribe();
  }
}
