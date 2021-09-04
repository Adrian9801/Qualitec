import { Component } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [LoginService]
})
export class AppComponent {

  public student = true;
  constructor(private router: Router, private loginService: LoginService, private menu: MenuController) { 
  }

  setStudent(valor:boolean){
    this.student = valor;
  }

  changePage(page: string){
    this.menu.close('custom');
    /*if(page == 'enrollment')
      window.location.reload();*/
    this.router.navigateByUrl(page);
  }
  
  logout(){
    this.loginService.logout().subscribe(res => {
      this.changePage('login');
    });
  }
}
