import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {oneRequest} from "./requests.model";
import {LoanRequest} from "../../calculator/calculator-form/loan-request.model";

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

  constructor(private http: HttpClient) {
  }

   getAllRequests(token: string) {
    return this.http
      .get<AdminResponseData>(
        'http://localhost:8000/request/list',
        {headers: new HttpHeaders({Authorization: "Bearer " + token})},
      )
  }



  requestApprove(request: oneRequest, token: string) {
    return this.http.put<LoanRequest>(
      'http://localhost:8000/request/' + request.id + '/approve',
      null,
      {headers: new HttpHeaders({Authorization: "Bearer " + token})}
      )
  }

  requestReject(request: oneRequest, token: string) {
    return this.http.put<LoanRequest>(
      'http://localhost:8000/request/' + request.id + '/cancel',
      null,
      {headers: new HttpHeaders({Authorization: "Bearer " + token})}
    )
  }

  displayFilteredSubject(requests: oneRequest[], subject: string) {
    if (subject === 'all') {
      return requests;
    } else if (subject === 'natural') {
      return requests.filter(obj => {
        return obj.applicantType === "INDIVIDUAL";
      });
    } else if (subject === 'legal') {
      return requests.filter(obj => {
        return obj.applicantType === "LEGAL_ENTITY";
      });
    } else if (subject === 'OSVC') {
      return requests.filter(obj => {
        return obj.applicantType === "OSVC";
      });
    }
    return null
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
