import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {LoanRequest} from "../../calculator/calculator-form/loan-request.model";
import {AdminService} from "../admin/admin.service";


@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css']
})
export class AdminDetailComponent implements OnInit, OnDestroy {
  allDetailData: LoanRequest;
  dataSubscription: Subscription;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) {
    const id = this.route.snapshot.params['id']
    this.showDetailData(id)
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
