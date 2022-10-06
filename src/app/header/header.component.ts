import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {AuthService} from "../auth/auth.service";
import {User} from "../auth/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private userSub: Subscription;
  loggedUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.loggedUser = user;
    });
  }

  onLogout() {
    this.authService.userLogout();
    this.loggedUser = null;
  }
}
