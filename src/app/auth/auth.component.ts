import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  error = null;
  private userSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const login = form.value.login;
    const password = form.value.password;
    const encoded = btoa(login + ":" + password);

    this.userSub = this.authService.userLogin(encoded)
      .subscribe(
        user => {
          if (user && (user.roles.includes("ADMIN") || user.roles.includes("SUPERVIZOR"))) {
            this.router.navigate(['/admin/allRequest'])
          }
        },
        error => {
          this.error = null;
          if (error.message === "username or password incorrect") {
            this.error = "Nesprávné přihlašovací údaje"
          } else if (error.message === "Connection refused!") {
            this.error = "Nelze se připojit k serveru";
          } else {
            this.error = "Neznámý error"
          }
        }
      )
  }

  ngOnDestroy() {
    if (this.userSub) {this.userSub.unsubscribe()}
  }

}
