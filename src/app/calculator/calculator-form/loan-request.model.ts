export class LoanRequest {
  applicantType: string;
  name: string;
  surname: string;

  // jednotlivec //

  birthNum?: string;

  ////////////////////

  // jednotlivec a OSVC //

  nationality?: string;

  ////////////////////

  email: string;
  phone: string;

  // firma a OSVC //

  IC?: string;

  ////////////////////

  // firma //

  position?: string;
  companyName?: string;

  ////////////////////

  amount: number;
  numOfMonths: number;

  ////////////////////

  address: {
    street: string,
    descNumber: number,
    indicativeNumber: number,
    city: string,
    postalCode: number
  }

  // ze serveru //

  created?: Date;
  status?: string;
  id?: string;

  ////////////////////

}
