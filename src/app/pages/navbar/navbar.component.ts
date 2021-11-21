import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReloadService } from 'src/app/Service/reload.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input()
  title: string;

  public href: string = "";
  public user: boolean;
  public loginButtonText: string = "Login/SignUp"; 
  public loginButtonAction: string = "/login"; 

  constructor(
    private router: Router,
    private userService: UserService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.loginButton();   
  }

  loginButton(){
    this.user=this.userService.getUserStatus();
    if(this.user==true){
      this.loginButtonText = "Logout";
      this.loginButtonAction = "/logout";
    }
  }

}
