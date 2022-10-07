import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {oneRequest} from "./requests.model";
import {BaseRequest, LoanRequest} from "../../calculator/calculator-form/loan-request.model";
import {catchError, empty, Observable, Subject} from "rxjs";
import {User} from "../../auth/user.model";

export interface SingleRequest {
  position: string;
  amount: number;
  numOfMonths: number;
  created: Date;
  status: string;
  id: string;
  name: string;
  surname: string;
  companyName: string;
  applicantType: string
}

export type AdminResponseData = SingleRequest[];

@Injectable({providedIn: 'root'})
export class AdminService {
  errorSubject = new Subject<string>()
  loggedUser: User;


  constructor(private http: HttpClient,) {
  }

  getAllRequests(token: string): Observable<AdminResponseData> {
    return this.http
      .get<AdminResponseData>(
        'http://localhost:8000/request/list',
        {headers: new HttpHeaders({Authorization: "Bearer " + token})},
      )
      .pipe(
        catchError(error => {
          if (error.error.error === "unknown user token") {
            this.errorSubject.next("Přístup zamítnut, nesprávná autorizace")
            return empty()
          } else {
            this.errorSubject.next("Nelze se připojit k serveru")
            return empty()
          }
        })
      )
  }

  getError(): Observable<string> {
    return this.errorSubject.asObservable()
  }


  requestApprove(request: BaseRequest, token: string) {
    return this.http.put<LoanRequest>(
      'http://localhost:8000/request/' + request.id + '/approve',
      null,
      {headers: new HttpHeaders({Authorization: "Bearer " + token})}
    ).subscribe((resData) => {
      request.status = resData.status;
    })
  }

  requestReject(request: BaseRequest, token: string) {
    return this.http.put<LoanRequest>(
      'http://localhost:8000/request/' + request.id + '/cancel',
      null,
      {headers: new HttpHeaders({Authorization: "Bearer " + token})}
    ).subscribe((resData) => {
      request.status = resData.status;
    })
  }

  displayFilteredSubject(requests: oneRequest[], subject: string): oneRequest[] {
    switch (subject) {
      case 'all':
        return requests
      case 'natural':
        return requests.filter(request => request.applicantType === "INDIVIDUAL");
      case 'legal':
        return requests.filter(request => request.applicantType === "LEGAL_ENTITY");
      case 'OSVC':
        return requests.filter(request => request.applicantType === "OSVC");
      default:
        return null;
    }
  }

  displayFilteredState(requests: oneRequest[], status: string) {
    if (status === 'all') {
      return requests;
    } else if (status === 'pending') {
      return requests.filter(obj => {
        return obj.status === "PENDING";
      });
    } else if (status === 'cancelled') {
      return requests.filter(obj => {
        return obj.status === "CANCELLED";
      });
    } else if (status === 'approved') {
      return requests.filter(obj => {
        return obj.status === "APPROVED";
      });
    }
    return null
  }

  filterFinal(subjectFiltered: oneRequest[], stateFiltered: oneRequest[]) {
    return subjectFiltered.filter(object1 => {
      return stateFiltered.some(object2 => {
        return object1.id === object2.id;
      });
    });
  }

  getDetailData(requestId: string) {
    return this.http.get<LoanRequest>(
      'http://localhost:8000/request/' + requestId
    )
  }
}
