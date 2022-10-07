import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {LoanRequest} from "../../calculator/calculator-form/loan-request.model";
import {AdminService} from "../admin/admin.service";
import {User} from "../../auth/user.model";
import {AuthService} from "../../auth/auth.service";
import {oneRequest} from "../admin/requests.model";


@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css']
})
export class AdminDetailComponent implements OnInit, OnDestroy {
  allDetailData: LoanRequest;
  dataSubscription: Subscription;
  loggedUser: User;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private authService: AuthService
  ) {
    const id = this.route.snapshot.params['id']
    this.showDetailData(id)
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.loggedUser = user;
    });
  }

  backToAllRequest() {
    this.router.navigate(['../../allRequest'], {relativeTo: this.route});
  }

  showDetailData(requestId: string) {
    this.dataSubscription = this.adminService.getDetailData(requestId)
      .subscribe(resData => {
        this.allDetailData = resData;
      });
  }

  onApprove() {
    this.adminService.requestApprove(this.allDetailData, this.loggedUser.token)
  }

  onReject() {
    this.adminService.requestReject(this.allDetailData, this.loggedUser.token)
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
