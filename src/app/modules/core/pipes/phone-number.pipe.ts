import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'phoneNumber' })
export class PhoneNumberFormatPipe implements PipeTransform {
  transform(value: string): String {
    return value;
  }
}
