import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CalculatorService} from "../calculator/calculator.service";
import {parse} from "@angular/compiler-cli/linker/babel/src/babel_core";

@Injectable({providedIn: 'root'})

export class RequestEditService {
  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private calcService: CalculatorService) {
  }

  initialAmtValue: number;
  initialDurValue: number;

  newAmtValue: number;
  newDurValue: number;

  requestEditMode = new Subject<boolean>;

  submitEdit() {
    if(!document.cookie) {
      document.cookie = "numOfTries: 0";
    }

    console.log('initial values: '+this.initialDurValue, this.initialAmtValue);

    var tries = parseInt(document.cookie.split(':')[1]);

    if(parseInt(document.cookie.split(':')[1]) < 3) {
      let currID = this.activatedRoute.queryParams['value'].reqID;

      if(!!this.newAmtValue || !!this.newDurValue) {
        if(!this.newDurValue) {
          this.newDurValue = this.initialDurValue;
        }

        if(!this.newAmtValue) {
          this.newAmtValue = this.initialAmtValue;
        }

        if(typeof this.newAmtValue === 'string') {
          this.newAmtValue = parseInt(this.newAmtValue);
        }

        if(typeof this.newDurValue === 'string') {
          this.newDurValue = parseInt(this.newDurValue);
        }

        let amount = this.newAmtValue;
        let numOfMonths = this.newDurValue;

        this.http.put('http://localhost:8000/request/'+currID, {amount, numOfMonths})
          .subscribe(
            resData => {
              let newData = ({
                ...this.calcService.formData,
                amount: resData['amount'],
                numOfMonths: resData['numOfMonths']
              });

              this.calcService.reqDetResponse.next(newData);
            }, error => {
              this.calcService.reqDetResponse.error('Připojení se serverem selhalo!');
            }
          )

        document.cookie = "";
        tries++;
        document.cookie = "numOfTries: "+tries;
      }

    } else {
      this.calcService.reqDetResponse.error('Je nám líto, tento požadavek dosáhl maximálního počtu úprav!');
    }
  }
}
