import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalculatorService} from "../calculator/calculator.service";
import {Subscription} from "rxjs";
import {LoanRequest} from "../calculator/calculator-form/loan-request.model";
import {RequestEditService} from "./request-edit.service";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {
  errMess: string;
  loanDetail: LoanRequest;
  loanStatus: string;
  editMode = false;

  requestSub: Subscription;

  constructor(private calcService: CalculatorService,
              private reqEditService: RequestEditService) { }

  ngOnInit(): void {
    this.calcService.fetchRequestData();
    this.requestSub = this.calcService.reqDetResponse.subscribe(
      responseData => {
        this.loanDetail = responseData;
        this.loanStatus = responseData.status;
        if(this.loanStatus === 'PENDING') {
          this.loanStatus = 'Čeká se na vyřízení...';
        } else if(this.loanStatus === 'CANCELLED') {
          this.loanStatus = 'Zamítnuto';
        } else {
          this.loanStatus = 'Schváleno!';
        }
      },
      error => {
        this.errMess = error;
      }
    )
  }

  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

  switchEditMode() {
    this.editMode = !this.editMode;
    this.reqEditService.requestEditMode.next(this.editMode);
  }

  submitEdit() {
    this.switchEditMode();

    this.reqEditService.submitEdit();
    //dalsi funkce
  }

}
