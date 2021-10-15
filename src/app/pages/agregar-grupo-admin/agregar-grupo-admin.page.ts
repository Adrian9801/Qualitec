import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RequestCourse } from 'src/app/models/requestCourse';
import { CookieService } from 'ngx-cookie-service'; 
import { LoginService } from 'src/app/services/login/login.service';
import { RequestService } from 'src/app/services/request/request.service'
import { AppComponent } from '../../app.component';
import { Teacher } from 'src/app/models/teacher';
import { GroupService } from 'src/app/services/group/group.service'

@Component({
  selector: 'app-agregar-grupo-admin',
  templateUrl: './agregar-grupo-admin.page.html',
  styleUrls: ['./agregar-grupo-admin.page.scss'],
  providers: [LoginService, RequestService, GroupService]
})
export class AgregarGrupoAdminPage implements OnInit {

  sedes = []
  Profesores: Teacher[] = []
  horasInicio = []
  horasFin = []
  dias = []

  sede = null
  numero = null
  cupos = null
  prof: string = null
  salon = null
  inicio : string
  fin = null
  diasSelected = []

  public curso = {nombre : "", codigo: ""}

  constructor(private groupService: GroupService, private loginService: LoginService, private requestService: RequestService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/agregar-grupo-admin') {
        //this.checkIfLoggedIn();
        this.loadTeachers();
        this.loadCourse();
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadTeachers(){
    this.groupService.getTeachers().subscribe(res => {
      this.Profesores = res[0] as Teacher[];
    });
  }

  loadCourse(){
    var recibido = history.state
    if(recibido.codigo == undefined)
      this.router.navigateByUrl('courses-list-admin');
    else{
      this.curso.nombre = recibido.nombre
      this.curso.codigo = recibido.codigo
    }
  }

  loadData(){
    this.sedes = [{sede:'Cartago'}];
    this.horasInicio =[{hora:"07:00"},{hora:"07:30"},{hora:"08:00"},{hora:"08:30"},{hora:"09:00"},{hora:"09:30"}
      ,{hora:"10:00"},{hora:"10:30"},{hora:"11:00"},{hora:"11:30"},{hora:"12:00"},{hora:"12:30"},{hora:"13:00"}
      ,{hora:"13:30"},{hora:"14:00"},{hora:"14:30"},{hora:"15:00"},{hora:"15:30"},{hora:"16:00"},{hora:"16:30"}
      ,{hora:"17:00"},{hora:"17:30"},{hora:"18:00"},{hora:"18:30"},{hora:"19:00"},{hora:"19:30"},{hora:"20:00"}
      ,{hora:"20:30"},{hora:"21:00"},{hora:"21:30"}];

    this.horasFin =[{hora:"07:30"},{hora:"08:00"},{hora:"08:30"},{hora:"09:00"},{hora:"09:30"}
      ,{hora:"10:00"},{hora:"10:30"},{hora:"11:00"},{hora:"11:30"},{hora:"12:00"},{hora:"12:30"},{hora:"13:00"}
      ,{hora:"13:30"},{hora:"14:00"},{hora:"14:30"},{hora:"15:00"},{hora:"15:30"},{hora:"16:00"},{hora:"16:30"}
      ,{hora:"17:00"},{hora:"17:30"},{hora:"18:00"},{hora:"18:30"},{hora:"19:00"},{hora:"19:30"},{hora:"20:00"}
      ,{hora:"20:30"},{hora:"21:00"},{hora:"21:30"},{hora:"22:00"}];
    this.dias = [{dia: "L", checked : false}, {dia: "K", checked : false}, {dia: "M", checked : false}
      ,{dia: "J", checked : false},{dia: "V", checked : false},{dia: "S", checked : false}];
  }

  GetHorasFin(){
    if (this.inicio == null){
      this.horasFin =[]
    }
    else{
      this.horasFin =this.horasInicio
      var seguir = true
      while(seguir){
        if(this.inicio.localeCompare(this.horasFin[0].hora)){
          this.horasFin.shift()
          seguir = false
        }
        else{
          this.horasFin.shift()
        }
      }
    }
    //this.cdr.detectChanges();
  }

  async enviar() {
    this.dias.forEach(dia => {
      if(dia.checked ==true){
        this.diasSelected.push(dia.dia)
      }
    });
    var formulario = {sede : this.sede, num : this.numero, cupos : this.cupos, prof : this.prof, 
    salon : this.salon, inicio : this.inicio, fin : this.fin, dias : this.diasSelected}
    console.log(formulario)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Agregar grupo',
      message: ('Curso: ' + this.curso.codigo + " " + this.curso.nombre + "\r" +
                "Sede: " + this.sede + "\r" +
                'Grupo: ' + this.numero + "\r" +
                "Profesor: " + this.prof + "\r" +
                "Cupos: " + this.cupos  + "\r" +
                "Salon: " + this.salon  + "\r" +
                "Dias: " + this.diasSelected  + "\r" +
                "Hora inicio: " + this.inicio + "\r" +
                "Hora fin: " + this.fin),
      buttons: ['Cancel', 'Confirmar']
    });

    await alert.present();
  }

  checkIfLoggedIn(){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else {
      this.loginService.checkLogIn({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        let list = res as JSON[];
        if(list.length > 0){
          const dateNow = new Date();
          dateNow.setMinutes(dateNow.getMinutes() + 15);
          this.cookieService.set('tokenAuth', res[0].token, dateNow);
          if(res[0].student)
            this.router.navigateByUrl('home-student');
          else{
            this.menu.setStudent(false);
          }
          this.menu.setEnable(false);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }
}
