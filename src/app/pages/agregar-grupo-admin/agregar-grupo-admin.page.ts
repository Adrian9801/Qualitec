import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RequestCourse } from 'src/app/models/requestCourse';
import { CookieService } from 'ngx-cookie-service'; 
import { LoginService } from 'src/app/services/login/login.service';
import { RequestService } from 'src/app/services/request/request.service'
import { AppComponent } from '../../app.component';
import { Teacher } from 'src/app/models/teacher';
import { Schedule } from 'src/app/models/schedule';
import { GroupService } from 'src/app/services/group/group.service'

@Component({
  selector: 'app-agregar-grupo-admin',
  templateUrl: './agregar-grupo-admin.page.html',
  styleUrls: ['./agregar-grupo-admin.page.scss'],
  providers: [LoginService, RequestService, GroupService]
})
export class AgregarGrupoAdminPage implements OnInit {

  private sedes = [];
  private Profesores: Teacher[] = [];
  private horasInicio = [];
  private horasFin = [];
  private dias = [];

  private sede: string = null;
  private numero = null;
  private cupos = null;
  private prof: Teacher = null;
  private salon: string = null;
  private inicio: string = null;
  private fin: string = null;
  private diasSelected: string[] = [];

  private curso = {nombre : "", codigo: ""};

  constructor(private groupService: GroupService, private loginService: LoginService, private requestService: RequestService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/agregar-grupo-admin') {
        this.checkIfLoggedIn();
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

    this.sede = null;
    this.numero = null;
    this.cupos = null;
    this.prof = null;
    this.salon = null;
    this.inicio = null;
    this.fin = null;
    this.diasSelected = [];
  }

  changeSelect(e){
    this.sede = e.target.value;
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
  }

  changeProf(e){
    this.Profesores.forEach(element => {
      if(element.cedula == e.target.value)
        this.prof = element;
    });
  }

  changeHour(e, hour: string){
    let hourString: string = e.target.value;
    if(hour == 'inicio'){
      if(this.fin != null){
        let hourI: number = +(hourString.replace(':',''));
        let hourF: number = +(this.fin.replace(':',''));
        if(hourI >= hourF){
          if(hourString.includes('30')){
            hourI = hourI/100 + 0.7;
            if(hourI < 10)
              this.fin = '0' + hourI + ':00';
            else
              this.fin = hourI + ':00';
          }
          else
            this.fin = this.inicio.replace('00','30');
        }
      }
    }
    else{
      if(this.inicio != null){
        let hourF: number = +(hourString.replace(':',''));
        let hourI: number = +(this.inicio.replace(':',''));
        if(hourI >= hourF){
          if(hourString.includes('00')){
            hourF = hourF/100 - 1;
            if(hourF < 10)
              this.inicio = '0' + hourF + ':30';
            else
              this.inicio = hourF+ ':30';
          }
          else
            this.inicio = this.fin.replace('30','00');
        }
      }
    }
  }

  checkScheduleClash(){
    let listScheduleTeacher: Schedule[] = [];
    this.groupService.getScheduleTeacher({cedula: this.prof.cedula})
      .subscribe(res => {
        listScheduleTeacher = res as Schedule[];
        for (let scheduleTeacher of listScheduleTeacher) {
          let listSchedule: string[] = scheduleTeacher.dias.split(",");
          for (let indexElement = 0; indexElement < listSchedule.length; indexElement++) {
            for (let indexDias = 0; indexDias < this.diasSelected.length; indexDias++) {
              if(listSchedule[indexElement] == this.diasSelected[indexDias]){
                if(this.checkHours(scheduleTeacher.horaInicio, scheduleTeacher.horaFin)){
                  this.presentAlert('Choque de horario', 'Hay un coche de horario del profesor seleccionado.');
                  return;
                }
                else
                  break;
              }
            }
          }
        }
        this.confirmGroup();
    });
  }

  checkHours(hourI: string, hourF: string){
    let hour1I: number = +(this.inicio.replace(':',''));
    let hour1F: number = +(this.fin.replace(':',''));

    let hour2I: number = +(hourI.replace(':',''));
    let hour2F: number = +(hourF.replace(':',''));

    if((hour1I <= hour2I && hour1F >= hour2I) || (hour2I <= hour1I && hour2F >= hour1I) || (hour1F <= hour2F && hour1I >= hour2F) || (hour2F <= hour1F && hour2I >= hour1F))
      return true;
    return false;
  }

  public async presentAlert(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: msg,
      buttons: ['Entendido']
    });

    await alert.present();
  }

  async confirmGroup(){
    let diasS: string = '';
    this.diasSelected.forEach(element => {
      diasS += element;
    });
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Agregar grupo',
      message: ('Curso: ' + this.curso.codigo + " " + this.curso.nombre + "<br>" +
                "Sede: " + this.sede + "<br>" +
                'Grupo: ' + this.numero + "<br>" +
                "Profesor: " + this.prof.nombre + "<br>" +
                "Cupos: " + this.cupos  + "<br>" +
                "Salon: " + this.salon  + "<br>" +
                "Dias: " + this.diasSelected  + "<br>" +
                "Hora inicio: " + this.inicio + "<br>" +
                "Hora fin: " + this.fin),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.groupService.createNewGroup({sede : this.sede, num : this.numero, cupos : this.cupos, prof : this.prof.cedula, 
              salon : this.salon, inicio : this.inicio, fin : this.fin, dias : diasS, codCurso: this.curso.codigo})
              .subscribe(res => {
                let result: {estado} = res as {estado};
                if(result.estado == 1)
                  this.router.navigateByUrl('home-admin');
                else
                  this.presentAlert('Número del grupo existente', 'El número del grupo para el curso ya existe.');
            });
          }  
        }
      ]
    });
    await alert.present();
  }

  enviar() {
    this.diasSelected = [];
    if(this.cookieService.check('tokenAuth')) {
      if(this.sede != null && this.numero != null && this.cupos != null && this.prof != null && this.salon != null && this.inicio != null && this.fin != null && this.salon.length > 0){
        if(Number.isInteger(this.cupos) && (this.cupos > 0) && Number.isInteger(this.numero) && (this.numero > 0)) {
          this.dias.forEach(dia => {
            if(dia.checked == true) {
              this.diasSelected.push(dia.dia);
            }
          });
          if(this.diasSelected.length > 0)
            this.checkScheduleClash();
          else 
            this.presentAlert('Seleccione los días', 'Debe seleccionar almenos un día.');
        }
        else 
          this.presentAlert('Error cupos o número grupo', 'El número del grupo y la cantidad de cupos debe ser una cantidad entera positiva.');
      }
      else 
        this.presentAlert('Falta datos', 'Complete todos los datos solicitados del grupo.');
    }
    else
      this.checkIfLoggedIn();
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
