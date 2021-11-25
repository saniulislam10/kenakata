
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExampleFlatNode } from 'src/app/interfaces/example-flat-node';
import { SideNavList } from 'src/app/interfaces/SideNavlist';
import { ReloadService } from 'src/app/Service/reload.service';
import { UserService } from 'src/app/Service/user.service';
import {map} from 'rxjs/operators';


// toggle menu
const TREE_DATA: SideNavList[] = [
  {
    name: 'Products',
    link: 'Products',
    children: [
      {
        name: 'All products',
        link: 'all-products'
      },
      {
        name: 'Add a product',
        link: 'add-product'
      }
    ],
  },
  {
    name: 'Gallery',
    link: 'gallery',
    children: [
      {
        name: 'Add folder',
        link: 'add-image-folder'
      }
    ],
  }
];



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


  // toggle menu

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  isMidDevice$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => {
        return result.matches;
      })
    );


  //toggle menu ends



  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService,
    private reloadService: ReloadService
  ) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.reloadService.refreshUser$
    .subscribe(() => {
      this.loginButton();   
    });
    this.loginButton();   
  }

  loginButton(){
    this.user=this.userService.getUserStatus();
    console.log('>>>>>');
    
    console.log(this.user);
    
    if(this.user==true){
      this.loginButtonText = "Logout";
      this.loginButtonAction = "/logout";
    }else{
      this.loginButtonText= "Login/SignUp"; 
      this.loginButtonAction = "/login"; 
    }
  }

}
