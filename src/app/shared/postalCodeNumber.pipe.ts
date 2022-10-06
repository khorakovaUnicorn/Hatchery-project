import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'postalCode'
})
export class PostalCodeNumberPipe implements PipeTransform {
  transform(value: any) {
    if (value?.toString().length != null) {
      return value.toString().replace(/(.{3})/g, '$1 ').trim();
    }
    return value;
  }

}
