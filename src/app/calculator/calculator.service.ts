import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {LoanRequest} from "./calculator-form/loan-request.model";
import {ActivatedRoute} from "@angular/router";

@Injectable({providedIn: 'root'})

export class CalculatorService {
  formData: LoanRequest =  new LoanRequest;
  amount: number = 598000;
  numOfMonths: number = 27;
  requestResponse = new Subject<{
    value?: any,
    error?: string
  }>();
  reqDetResponse = new Subject<LoanRequest>();

  errAddress = new Subject<boolean>();

  fetchedData = new Subject<{
    monthlyPayment: number,
    yearlyInterest: number,
    RPSN: number,
    overallAmount: number,
    fixedFee?: number
  }>()

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  sendCalcData(amount: number, numOfMonths: number) {
    amount = +amount;
    numOfMonths = +numOfMonths;

    this.amount = amount;
    this.numOfMonths = numOfMonths;

    this.http.post(
      'http://localhost:8000/request/calculate',
      {amount, numOfMonths}
      ).subscribe(resData => {
        this.fetchCalcData(resData)
    }, error => {
        this.fetchCalcData(error);
    });
  }

  fetchCalcData(resData) {
    if(resData.monthlyPayment) {    //check, jestli se správně načetla data
      let monthlyPayment: number = resData.monthlyPayment;
      let yearlyInterest: number = resData.yearlyInterest;
      let RPSN: number = resData.RPSN;
      let overallAmount: number = resData.overallAmount;
      let fixedFee: number = resData.fixedFee;

      this.fetchedData.next({monthlyPayment, yearlyInterest, RPSN, overallAmount, fixedFee});
    } else {
      this.fetchedData.error('Připojení se serverem selhalo!');
    }
  }

  getDataFromUser(
    applicantType: string,
    name: string,
    surname: string,
    birthNum: string | null,
    nationality: string | null,
    email: string,
    phone: string,
    IC: string | null,
    position: string | null,
    companyName: string | null,
    address: {
      street: string,
      descNumber: number,
      indicativeNumber: number,
      city: string,
      postalCode: number
    }) {

    if(applicantType === 'INDIVIDUAL') {
      this.formData.applicantType = 'INDIVIDUAL';
      this.formData.nationality = nationality;
      this.formData.birthNum = birthNum;
    } else if(applicantType === 'OSVC') {
      this.formData.nationality = nationality;
      this.formData.IC = IC;
    } else {
      this.formData.IC = IC;
      this.formData.position = position;
      this.formData.companyName = companyName;
    }

    this.formData.name = name;
    this.formData.surname = surname;

    this.formData.email = email;
    this.formData.phone = phone;
    this.formData.amount = this.amount;
    this.formData.numOfMonths = this.numOfMonths;
    address.descNumber = +address.descNumber;
    address.indicativeNumber = +address.indicativeNumber;
    address.postalCode = +address.postalCode;
    this.formData.address = address;

    console.log(this.formData);

    this.submitRequest(this.formData);
  }

  submitRequest (formData: LoanRequest) {
    this.http.post(
      'http://localhost:8000/request/create',
      formData)
      .subscribe( response => {
        this.requestResponse.next({value: response['id']});
      }, error => {
        this.requestResponse.next({error: error});
      }
    )
  }

  fetchRequestData() {
    let currID = this.activatedRoute.queryParams['value'].reqID;

    this.http.get<LoanRequest>(
      'http://localhost:8000/request/'+currID)
      .subscribe(response => {
        this.formData.applicantType = response.applicantType;

        if(this.formData.applicantType === 'INDIVIDUAL') {
          this.formData.nationality = response.nationality;
          this.formData.birthNum = response.birthNum;
        } else if(this.formData.applicantType === 'OSVC') {
          this.formData.nationality = response.nationality;
          this.formData.IC = response.IC;
        } else {
          this.formData.IC = response.IC;
          this.formData.position = response.position;
          this.formData.companyName = response.companyName;
        }

        this.formData.name = response.name;
        this.formData.surname = response.surname;

        this.formData.email = response.email;
        this.formData.phone = response.phone;
        this.formData.amount = response.amount;
        this.formData.numOfMonths = response.numOfMonths;
        this.formData.address = response.address;
        this.formData.status = response.status;

      this.reqDetResponse.next(this.formData);
    }, error => {
      this.reqDetResponse.error('Připojení k serveru se nezdařilo!');
    })
  }
}
