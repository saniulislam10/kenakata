import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  dataForm: FormGroup;
  private subRouteOne?: Subscription;
  href: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      phone: [null, Validators.required],
      password: [null, Validators.required],
    });
  }


  onSubmitForm(){
    let user = {
      username: this.dataForm.value.phone,
      password: this.dataForm.value.password,
    }
    this.userService.userLogin(user);

  }
}
