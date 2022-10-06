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
  genders = ['male', 'female'];

  constructor(private httpClient: HttpClient,
              private calcService: CalculatorService) {
  }

  ngOnInit(): void {
    this.loanFormIndividual = new FormGroup({
      'applicantType': new FormControl(ApplicantType.INDIVIDUAL),
      'gender': new FormControl('male'),
      'name': new FormControl(null, [Validators.required]),
      'surname': new FormControl(null, [Validators.required]),
      'birthNum': new FormControl(null,[this.birthNumValidator.bind(this)]),
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
      rawValue.address,
    )
  }

  onAddressChange() {
    this.calcService.errAddress.next(false);
  }


  birthNumValidator(control: FormControl): {[s: string]: boolean } {
    let controlValue = control.value;
    const RegEx2 = /\//;
    if (controlValue != null) {
      let controlValueWithoutSlash = controlValue.replace(RegEx2, '');
      const RegExp = /[0-9]{6}\/?[0-9]{3,4}/;
      if (RegExp.test(controlValue) !== true) {
        return {'birthNumValidator': true};
      }
      if (controlValueWithoutSlash.lengt !== 10 && controlValueWithoutSlash % 11 !== 0) {
        return {'birthNumValidator': true};
      }
    }
    return null;
  }


  ngOnDestroy() {
    this.resSub.unsubscribe();
    this.errSub.unsubscribe();
  }
}
