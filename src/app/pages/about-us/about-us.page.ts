import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  providers: [LoginService]
})
export class AboutUsPage implements OnInit {
  private title: string = "Acerca de nosotros";
  private opened: boolean = false;

  constructor(public menu:AppComponent, private router: Router, private loginService: LoginService) { 
    menu.setStudent(true);
  }

  ngOnInit() {
    //this.checkLogIn();
  }

  checkLogIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(!res)
        this.router.navigateByUrl('login');
    });
  }
}
