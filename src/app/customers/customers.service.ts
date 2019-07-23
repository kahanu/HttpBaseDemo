import { Injectable } from '@angular/core';
import { HttpBase } from 'src/app/core/http-base';
import { ExceptionService } from 'src/app/core/services/exception.service';
import { HttpClient } from '@angular/common/http';
import { Entity } from 'src/app/core/models/base';

export class Customer extends Entity {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends HttpBase<Customer> {
  constructor(
    protected http: HttpClient,
    protected exceptionService: ExceptionService
  ) {
    super(http, exceptionService);
  }

  /** Add any custom service methods here. */
}
