import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user.model";
import {AdminService} from "./admin.service";
import {oneRequest} from "./requests.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  loggedUser: User;
  allRequests: oneRequest[];
  displayedRequests: oneRequest[];
  subjectSelection: string = 'all';
  stateSelection: string = 'all';
  sortedAlphabet = '';
  sortedLoan = '';
  error = null;
  private userSub: Subscription;
  private requestListSub: Subscription;
  private requestApproveSub: Subscription;
  private requestRejectSub: Subscription;


  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.loggedUser = user;

    });
    this.onGetAllRequests();
  }

  onGetAllRequests() {
    this.error = null;
    this.requestListSub = this.adminService.getAllRequests(this.loggedUser.token)
      .subscribe(
        resData => {
          this.allRequests = resData;
          if (!this.displayedRequests) {
            this.displayedRequests = [...this.allRequests]
          }
        },
        error => {
          if (error.error.error === "unknown user token") {
            this.error = "Přístup zamítnut, nesprávná autorizace"
          } else {
            this.error = "Nelze se připojit k serveru"
          }
        }
      )
  }

  onApprove(request: oneRequest) {
    this.error = null;
    this.requestApproveSub = this.adminService.requestApprove(request, this.loggedUser.token)
      .subscribe((resData) => {
          request.status = resData.status;
        },
        error => {
          if (error.error.error === "unknown user token") {
            this.error = "Přístup zamítnut, nesprávná autorizace"
          } else {
            this.error = "Nelze se připojit k serveru"
          }
        }
      )
  }

  onReject(request: oneRequest) {
    this.error = null;
    this.requestRejectSub = this.adminService.requestReject(request, this.loggedUser.token)
      .subscribe((resData) => {
          request.status = resData.status;
        },
        error => {
          if (error.error.error === "unknown user token") {
            this.error = "Přístup zamítnut, nesprávná autorizace"
          } else {
            this.error = "Nelze se připojit k serveru"
          }
        }
      )
  }

  onFiltering() {
    let filteredBySubject = this.adminService.displayFilteredSubject(this.allRequests, this.subjectSelection);
    let filteredByState = this.adminService.displayFilteredState(this.allRequests, this.stateSelection);
    this.displayedRequests = this.adminService.filterFinal(filteredBySubject, filteredByState);
    if (this.sortedLoan) {
      this.onLoanSorting(this.sortedLoan);
    } else if (this.sortedAlphabet) {
      this.onAlphabetSorting(this.sortedAlphabet);
    }
  }

  onAlphabetSorting(event) {
    if (event === "AZ") {
      this.displayedRequests = this.displayedRequests.sort(
        (a, b) => (a.surname > b.surname) ? 1 : ((b.surname > a.surname) ? -1 : 0)
      )
    } else if (event === "ZA") {
      this.displayedRequests = this.displayedRequests.sort(
        (a, b) => (a.surname < b.surname) ? 1 : ((b.surname < a.surname) ? -1 : 0)
      )
    }
    this.sortedLoan = '';
  }

  onLoanSorting(event) {
    if (event === "min") {
      this.displayedRequests = this.displayedRequests.sort(
        (a, b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0)
      )
    } else if (event === "max") {
      this.displayedRequests = this.displayedRequests.sort(
        (a, b) => (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0)
      )
    }
    this.sortedAlphabet = '';
  }

  openDetail(requestId: string) {
    // this.router.navigate([`../detail/${requestId}`], { relativeTo: this.route });
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`../detail/${requestId}`], {relativeTo: this.route})
    );

    window.open(url, '_blank');
  }


  ngOnDestroy() {
    this.requestListSub.unsubscribe();
    this.userSub.unsubscribe();
    if (this.requestRejectSub) {this.requestRejectSub.unsubscribe()}
    if (this.requestApproveSub) {this.requestApproveSub.unsubscribe()}
  }

}
