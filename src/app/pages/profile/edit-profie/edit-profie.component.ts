import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { UserDataService } from 'src/app/Service/user-data.service';

@Component({
  selector: 'app-edit-profie',
  templateUrl: './edit-profie.component.html',
  styleUrls: ['./edit-profie.component.css']
})
export class EditProfieComponent implements OnInit {

  public dataForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      _id: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
    });
    this.getLoggedInUserInfo();
  }

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
    .subscribe(res => {
      this.user = res.data;
      this.dataForm.patchValue(this.user);
      }, error => {
        console.log(error);
      });

    
  }

  onSubmitForm(){

    let user = {
      firstName: this.dataForm.value.firstName,
      lastName: this.dataForm.value.lastName,
      email: this.dataForm.value.email,
      phone: this.dataForm.value.phone,
      address: this.dataForm.value.address,
      username: this.dataForm.value.phone
    }
    if (this.user._id) {
      const finalData = {...user, ...{_id: this.user._id}};
      console.log(finalData);
      this.editUserData(finalData);
    }
  }
  editUserData(info){
    console.log(info);
    this.userDataService.editLoginUserInfo(info)
    .subscribe(res => {
      console.log(res.message);
    })
  }

}
