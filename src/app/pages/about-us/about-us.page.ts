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
  }

  ngOnInit() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(res){
        this.loginService.getUser()
        .subscribe(result =>{
          let list = result as JSON[];
          if(list.length > 0){
            if(result[1].student)
              this.menu.setStudent(true);
            else
              this.menu.setStudent(false);
          }
        });
      }
      else
        this.router.navigateByUrl('login');
    });
  }
}
