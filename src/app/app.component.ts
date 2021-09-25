import { Component } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
import { MenuController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [LoginService]
})
export class AppComponent {

  public student = true;
  constructor(private cookieService: CookieService, private router: Router, private loginService: LoginService, private menu: MenuController) { 
  }

  setStudent(valor:boolean){
    this.student = valor;
  }

  changePage(page: string){
    this.menu.close('custom');
    this.router.navigateByUrl(page);
  }
  
  logout(){
    this.cookieService.delete('tokenAuth');
    this.changePage('login');
  }
}
