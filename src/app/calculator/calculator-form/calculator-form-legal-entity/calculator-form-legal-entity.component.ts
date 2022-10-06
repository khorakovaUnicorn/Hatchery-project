import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApplicantType} from "../calculator-form.component";
import {CalculatorService} from "../../calculator.service";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-calculator-form-legal-entity',
  templateUrl: './calculator-form-legal-entity.component.html',
  styleUrls: ['../calculator-form.component.css']
})
export class CalculatorFormLegalEntityComponent implements OnInit, OnDestroy {
  loanFormLegalEntity: FormGroup;
  resSub: Subscription;
  errAddress: boolean = false;
  errSub: Subscription;

  constructor(private httpClient: HttpClient,
              private calcService: CalculatorService) {}

  ngOnInit(): void {
    this.loanFormLegalEntity = new FormGroup({
      'applicantType': new FormControl(ApplicantType.LEGAL_ENTITY),
      'name': new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
      'surname': new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
      'IC': new FormControl(null,[Validators.required, Validators.pattern("^[1-9]+[0-9]*$")]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phone': new FormControl(null,[Validators.pattern("^[1-9]+[0-9]*$"), Validators.maxLength(9)]),
      'address': new FormGroup({
        'street': new FormControl(),
        'descNumber': new FormControl(null, [Validators.pattern("^[1-9]+[0-9]*$")]),
        'indicativeNumber': new FormControl(),
        'city': new FormControl(),
        'postalCode': new FormControl(null, [Validators.pattern("^[1-9]+[0-9]*$"), Validators.maxLength(5)])
      }),
      'companyName': new FormControl(null, [Validators.required]),
      'position': new FormControl("Člen/ka představenstva")
    });
    this.resSub = this.calcService.requestResponse.subscribe(response => {
      this.errAddress = !!response.error;
    });

    this.errSub = this.calcService.errAddress.subscribe(resData => {
      this.errAddress = resData;
    });
  }

  onSubmit() {
    let rawValue = this.loanFormLegalEntity.getRawValue();

    this.calcService.getDataFromUser(
      'Company',
      rawValue.name,
      rawValue.surname,
      null,
      null,
      rawValue.email,
      rawValue.phone,
      rawValue.IC,
      rawValue.position,
      rawValue.companyName,
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
