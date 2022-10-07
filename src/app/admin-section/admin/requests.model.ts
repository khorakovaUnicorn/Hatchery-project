import {BaseRequest} from "../../calculator/calculator-form/loan-request.model";

export class oneRequest implements BaseRequest{
  constructor(
    public position: string,
    public amount: number,
    public numOfMonths: number,
    public created: Date,
    public status: string,
    public id: string,
    public name: string,
    public surname: string,
    public companyName: string,
    public applicantType: string
) {}
}


