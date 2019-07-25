import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, CustomersService } from './customers.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$: Observable<Customer[]>;
  customer$: Observable<Customer>;
  title: string;
  form: FormGroup;
  showEditForm = false;

  constructor(private customerService: CustomersService,
              private fb: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
     this.customers$ = this.customerService.getAll('customers')
      .pipe(map(res => res.data as Customer[]));
  }

  initForm(model: Customer) {
    this.form = this.fb.group({
      _id: [model ? model._id : null],
      firstName: [model ? model.firstName : '', [Validators.required]],
      lastName: [model ? model.lastName : '', [Validators.required]],
      email: [model ? model.email : '']
    });
  }

  addCustomer() {
    this.title = 'Add Customer';
    this.initForm(new Customer());
    this.showEditForm = true;
  }

  editCustomer(customer: Customer) {
    this.title = 'Edit Customer';
    this.customerService.getById(customer._id, 'customers')
      .pipe(map(res => res.data as Customer))
      .subscribe(c => {
        this.initForm(c);
        this.showEditForm = true;
      });
  }

  saveCustomer() {
    const customer = this.form.value;

    this.customerService.save(customer, 'customers')
      .subscribe(res => {
        if (res.success) {
          this.showEditForm = false;
          this.loadCustomers();
          this.toastr.success('Customer saved successfully!', 'Save Customer');
        }
      }, error => this.toastr.error('Error saving customer.', 'Save Customer Error'));
  }

  deleteCustomer(customer: Customer) {
    if (confirm('You are about to delete a Customer?')) {
      this.customerService.delete(customer, 'customers')
        .subscribe(() => {
            this.loadCustomers();
            this.toastr.success('Customer deleted successfully!', 'Delete Customer');
        }, error => this.toastr.error(error, 'Delete Customer Error'));
    }
  }

  closeForm() {
    this.showEditForm = false;
  }
}
