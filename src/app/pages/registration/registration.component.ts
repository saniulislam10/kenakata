import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiService } from 'src/app/Service/ui.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public dataForm: FormGroup;
  
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
    });
  }
  
  onSubmitForm(){
    let user = {
      firstName: this.dataForm.value.firstName,
      lastName: this.dataForm.value.lastName,
      email: this.dataForm.value.email,
      phone: this.dataForm.value.phone,
      address: this.dataForm.value.address,
      password: this.dataForm.value.password,
      username: this.dataForm.value.phone
    }

    if (this.dataForm.value.password !== this.dataForm.value.confirmPassword) {
      this.uiService.warn('Password and confirm password not matched');
      return;
    }

    console.log(user);

    this.userService.userRegistration(user);

    // this.dataForm.reset();
  }

}
