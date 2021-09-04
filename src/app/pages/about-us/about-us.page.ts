import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
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

  constructor(private menu: MenuController, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.checkLogIn();
  }

  openCustom() {
    this.opened = true;
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
    this.title = "Menú";
  }

  closeCustom() {
    if(this.opened){
      this.opened = false;
      this.title = "Acerca de nosotros";
      this.menu.close('custom');
    }
  }

  changePage(page: string){
    this.closeCustom();
    if(page == 'about-us')
      window.location.reload();
    this.router.navigateByUrl(page);
  }

  checkLogIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(!res)
        this.router.navigateByUrl('login');
    });
  }

  logout(){
    this.loginService.logout().subscribe(res => {
      this.changePage('login');
    });
  }
}
