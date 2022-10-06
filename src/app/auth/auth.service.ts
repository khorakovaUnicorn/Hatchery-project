import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

import {User} from "./user.model";

export interface AuthResponseData {
  login: string;
  name: string;
  roles: [string];
  token: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);


  constructor(private http: HttpClient) {
   let localStorageUser = localStorage.getItem('user')
    if (localStorageUser !==null) {
      this.user.next(JSON.parse(localStorageUser))
    }
  }

  // Headers needed for login GET method: Authorization: base64(login:password)
  userLogin(encoded_login_password: string) {
    return this.http
      .get<AuthResponseData>(
        'http://localhost:8000/login',
        {headers: new HttpHeaders({Authorization: "Basic " + encoded_login_password})},
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.login,
            resData.name,
            resData.roles,
            resData.token
          );
        })
      )
  }

  userLogout(){
    this.user.next(null);
    localStorage.removeItem('user')
  }

  private handleAuthentication(
    login: string,
    name: string,
    roles: [string],
    token: string
  ) {
    const user = new User(
      login,
      name,
      roles,
      token
    );
    this.user.next(user);
    localStorage.setItem('user',JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Connection refused!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    if (errorRes.error.error === "username or password incorrect") {
      errorMessage = errorRes.error.error;
    }
    return throwError(() => new Error(errorMessage));
  }

}




