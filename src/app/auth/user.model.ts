export class User {
  constructor(
    public login: string,
    public name: string,
    public roles: [string],
    public token: string
  ) {}
}

