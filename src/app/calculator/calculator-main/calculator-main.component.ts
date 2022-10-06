import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl} from "@angular/forms";
import {CalculatorService} from "../calculator.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-calculator-main',
  templateUrl: './calculator-main.component.html',
  styleUrls: ['./calculator-main.component.css']
})
export class CalculatorMainComponent implements OnInit, OnDestroy{
  calculateForm: FormGroup;
  amountValue: number = 598000;
  numOfMonths: number = 33;
  durationMessage = '2 roky a 9 měsíců';
  hasBeenTouched = false;
  errMess = null;

  //vypočítané hodnoty

  monthlyPayment: number;
  yearlyInterest: number;
  RPSN: number;
  overallAmount: number;
  fixedFee: number;

  editMode:boolean = false;

  constructor(private calcService: CalculatorService,
              private router: Router) {
  }

  ngOnInit() {
    this.calculateForm = new FormGroup({
      'amount': new FormControl(null),
      'duration': new FormControl(null)
    });
  }

  //načítání vypočítaných hodnot

  calcSubscription = this.calcService.fetchedData.subscribe(fetchedData => {
    this.hasBeenTouched = true;
    this.monthlyPayment = fetchedData.monthlyPayment;
    this.yearlyInterest = fetchedData.yearlyInterest;
    this.RPSN = fetchedData.RPSN;
    this.overallAmount = fetchedData.overallAmount;

      this.fixedFee = fetchedData.fixedFee;

  },error => {
      this.hasBeenTouched = false;
      this.errMess = error;
    }
  )

  ngOnDestroy() {
    this.calcSubscription.unsubscribe();
  }

  onSubmit() {
    this.router.navigate(['calc/calc-form']);
  }

  amtChange(e) {        //mění hodnotu částky
    this.amountValue = e.target.value;
    this.calcService.sendCalcData(this.amountValue, this.numOfMonths);
  }

  durChange(e) {   //meni mesice
    let months = e.target.value;
    this.numOfMonths = months;

    this.countMonths(months);

    this.calcService.sendCalcData(this.amountValue, months);

    //this.calcService.sendCalcData({ this.amountValue, months});
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

  selectVal(e) {
    this.editMode = true;
    e.target.select();
    setTimeout(() => {
      document.addEventListener('click', eventTarget => {
        if(eventTarget.target !== e.target) {
          this.changeAmtManually();
        }
      }, {once: true});
    }, 0);
    let enterListener = e.target.addEventListener('keypress', enterEvent => {
      console.log(enterEvent.key);
      if(enterEvent.key === 'Enter') {
        this.changeAmtManually();
        e.target.removeEventListener('keypress', enterListener);
      }

      //TODO enterem jde zadat hodnota několikrát - způsobuje errory
    }/*, {once: true}*/);
  }

  changeAmtManually() {
    let newVal = parseInt((<HTMLInputElement>document.getElementsByClassName('valueChangeHolder')[0]).value);
    console.log('newVal: '+ typeof newVal + ' = '+newVal);
    this.amountValue = this.roundToThousand(newVal);
    this.calcService.sendCalcData(this.amountValue, this.numOfMonths);
  }

  roundToThousand(num: number) {
    let rest = num % 1000;
    num = num - rest;

    if(num < 6000) {
      rest = 6000;
    } else if (num > 1200000) {
      rest = 1200000;
    } else {
      if(rest !== 0) {
        rest = rest / 1000;
        rest = Math.round(rest);
        rest = rest * 1000;
        rest = num + rest;
      } else {
        rest = num;
      }
    }
    return rest;
  }

}
