import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription, tap} from "rxjs";

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
  displayedRequestsObservable: Observable<oneRequest[]>;
  errorObservable: Observable<string>;
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
    this.displayedRequestsObservable = this.adminService.getAllRequests(this.loggedUser.token)
    this.errorObservable = this.adminService.getError()
  }

  onApprove(request: oneRequest) {
    this.adminService.requestApprove(request, this.loggedUser.token)
  }

  onReject(request: oneRequest) {
    this.adminService.requestReject(request, this.loggedUser.token)
  }

  onFiltering() {
    this.displayedRequestsObservable = this.displayedRequestsObservable
      .pipe(
        map(requests =>
          this.adminService.displayFilteredSubject(requests, this.subjectSelection)
        ),
        map(requests =>
          this.adminService.displayFilteredState(requests, this.stateSelection)
        )
      )
  }

  onAlphabetSorting(event) {
    if (event === "AZ") {
      this.displayedRequestsObservable = this.displayedRequestsObservable
        .pipe(
          map(result => {
            return result.sort((a, b) => (a.surname > b.surname) ? 1 : ((b.surname > a.surname) ? -1 : 0))
          })
        );
    } else if (event === "ZA") {
      this.displayedRequestsObservable = this.displayedRequestsObservable
        .pipe(
          map(
            result => {
              return result.sort((a, b) => (a.surname < b.surname) ? 1 : ((b.surname < a.surname) ? -1 : 0))
            })
        );
    }
  }

  onLoanSorting(event) {
      if (event === "min") {
        this.displayedRequestsObservable = this.displayedRequestsObservable
          .pipe(
            map(
              result => {
                return result.sort((a, b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0))
              }
            )
          )
      } else if (event === "max") {
        this.displayedRequestsObservable = this.displayedRequestsObservable
          .pipe(
            map(
              result => {
                return result.sort((a, b) => (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0))
              }
            )
          )
      }
  }

  openDetail(requestId: string) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`../detail/${requestId}`], {relativeTo: this.route})
      );
      window.open(url, '_blank');
  }


  ngOnDestroy() {
    //   this.requestListSub.unsubscribe();
    //   this.userSub.unsubscribe();
    //   if (this.requestRejectSub) {this.requestRejectSub.unsubscribe()}
    //   if (this.requestApproveSub) {this.requestApproveSub.unsubscribe()}
  }

}
