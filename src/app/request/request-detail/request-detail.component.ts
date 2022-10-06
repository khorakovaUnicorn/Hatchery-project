import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {CalculatorService} from "../../calculator/calculator.service";
import {LoanRequest} from "../../calculator/calculator-form/loan-request.model";
import {RequestEditService} from "../request-edit.service";

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  responseSub: Subscription;
  editModeChange: Subscription;
  loanDetail: LoanRequest;
  applicantType: string;
  street: string;
  city: string;
  descNumber: number;
  indicativeNumber: number;
  postalCode: number;
  amount: number;
  numOfMonths: number;
  durationMessage: string;

  editMode = false;

  constructor(private calcService: CalculatorService,
              private reqEditService: RequestEditService) { }

  ngOnInit(): void {
    this.calcService.fetchRequestData();
    this.responseSub = this.calcService.reqDetResponse.subscribe(
      responseData => {
        this.loanDetail = responseData;

        if(this.loanDetail.applicantType === 'INDIVIDUAL') {
          this.applicantType = 'Fyzická osoba';
        } else if (this.loanDetail.applicantType === 'OSVC') {
          this.applicantType = 'OSVČ';
        } else {
          this.applicantType = 'Firma';
        }

        this.street = this.loanDetail.address.street;
        this.city = this.loanDetail.address.city;
        this.indicativeNumber = this.loanDetail.address.indicativeNumber;
        this.postalCode = this.loanDetail.address.postalCode;
        this.descNumber = this.loanDetail.address.descNumber;

        this.amount = this.loanDetail.amount;
        this.numOfMonths = this.loanDetail.numOfMonths;

        this.countMonths(this.numOfMonths);

        //nastavi vychozi hodnotu pro castku a dobu trvani

        this.reqEditService.initialAmtValue = this.loanDetail.amount;
        this.reqEditService.initialDurValue = this.loanDetail.numOfMonths;

      }
    )
    this.editModeChange = this.reqEditService.requestEditMode.subscribe(
      toggle => {
        this.editMode = toggle;
      }
    )
  }

  ngOnDestroy() {
    this.responseSub.unsubscribe();
    this.editModeChange.unsubscribe();
  }

  durChange(e) {
    this.numOfMonths = e.target.value;
    this.countMonths(this.numOfMonths);
    this.reqEditService.newDurValue = this.numOfMonths;
  }

  amtChange(e) {
    this.amount = e.target.value;
    this.reqEditService.newAmtValue = this.amount;
  }

  countMonths(months: number) {
    let yearMonth = [0,0];
    if(months >= 12) {
      yearMonth[0] = Math.floor(months / 12);
      yearMonth[1] = months % 12;
    } else {
      yearMonth[1] = months;
    }

    let firstMess = '';

    switch(true) {
      case (yearMonth[0] === 1):
        firstMess = '1 rok';
        break;
      case (yearMonth[0] > 1 && yearMonth[0] < 5):
        firstMess = yearMonth[0] + ' roky';
        break;
      case(yearMonth[0] >= 5):
        firstMess = yearMonth[0] + ' let';
        break;
    }

    let scdMess = '';

    switch(true) {
      case (yearMonth[1] === 1):
        scdMess = '1 měsíc';
        break;
      case(yearMonth[1] > 1 && yearMonth[1] < 5):
        scdMess = yearMonth[1] + ' měsíce';
        break;
      case(yearMonth[1] >= 5):
        scdMess = yearMonth[1] + ' měsíců';
        break;
    }

    let connector = '';
    if(yearMonth[0] !== 0 && yearMonth[1] !== 0) {
      connector = ' a ';
    }

    this.durationMessage = firstMess + connector + scdMess;
  }

}
