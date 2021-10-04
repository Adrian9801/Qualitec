import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-agregar-grupo-admin',
  templateUrl: './agregar-grupo-admin.page.html',
  styleUrls: ['./agregar-grupo-admin.page.scss'],
})
export class AgregarGrupoAdminPage implements OnInit {

  sedes = []
  Profesores = []
  horasInicio = []
  horasFin = []
  dias = []

  sede = null
  numero = null
  cupos = null
  prof = null
  salon = null
  inicio : string
  fin = null
  diasSelected = []

  public curso = {nombre : "", codigo: ""}

  constructor( public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    var recibido = history.state
    this.curso.nombre = recibido.curso
    this.curso.codigo = recibido.codigo

    this.sedes = [{sede:'Cartago'}]
    this.Profesores = [{profesor:"Ignacio Trejos"}, {profesor:"Mario Chacon"}, {profesor:"Mauricio Montero"},
    {profesor:"Jose Carranza"}]
    this.horasInicio =[{hora:"07:00"},{hora:"07:30"},{hora:"08:00"},{hora:"08:30"},{hora:"09:00"},{hora:"09:30"}
    ,{hora:"10:00"},{hora:"10:30"},{hora:"11:00"},{hora:"11:30"},{hora:"12:00"},{hora:"12:30"},{hora:"13:00"}
    ,{hora:"13:30"},{hora:"14:00"},{hora:"14:30"},{hora:"15:00"},{hora:"15:30"},{hora:"16:00"},{hora:"16:30"}
    ,{hora:"17:00"},{hora:"17:30"},{hora:"18:00"},{hora:"18:30"},{hora:"19:00"},{hora:"19:30"},{hora:"20:00"}
    ,{hora:"20:30"},{hora:"21:00"},{hora:"21:30"},{hora:"22:00"}]

    this.horasFin =[{hora:"07:00"},{hora:"07:30"},{hora:"08:00"},{hora:"08:30"},{hora:"09:00"},{hora:"09:30"}
    ,{hora:"10:00"},{hora:"10:30"},{hora:"11:00"},{hora:"11:30"},{hora:"12:00"},{hora:"12:30"},{hora:"13:00"}
    ,{hora:"13:30"},{hora:"14:00"},{hora:"14:30"},{hora:"15:00"},{hora:"15:30"},{hora:"16:00"},{hora:"16:30"}
    ,{hora:"17:00"},{hora:"17:30"},{hora:"18:00"},{hora:"18:30"},{hora:"19:00"},{hora:"19:30"},{hora:"20:00"}
    ,{hora:"20:30"},{hora:"21:00"},{hora:"21:30"},{hora:"22:00"}]
    this.dias = [{dia: "L", checked : false}, {dia: "K", checked : false}, {dia: "M", checked : false}
  ,{dia: "J", checked : false},{dia: "V", checked : false},{dia: "S", checked : false}]
  }

  GetHorasFin(){
    console.log(this.inicio)
    if (this.inicio == null){
      this.horasFin =[]
    }
    else{
      this.horasFin =this.horasInicio
      var seguir = true
      while(seguir){
        if(this.inicio.localeCompare(this.horasFin[0].hora)){
          this.horasFin.shift()
          console.log(this.horasFin)
          seguir = false
        }
        else{
          this.horasFin.shift()
        }
      }
    }
    //this.cdr.detectChanges();
  }

  enviar(){
    this.dias.forEach(dia => {
      if(dia.checked ==true){
        this.diasSelected.push(dia.dia)
      }
    });
    var formulario = {sede : this.sede, num : this.numero, cupos : this.cupos, prof : this.prof, 
    salon : this.salon, inicio : this.inicio, fin : this.fin, dias : this.diasSelected}
    console.log(formulario)
  }

}
