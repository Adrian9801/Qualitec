import { Group } from './../../models/group';
import { StaticReflector } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Mode } from '@ionic/core';
import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  numeroDia = '1';
  horaInicio = '0700';
  horaFin = '0800';

  private enrolledCourses: Group[] = [];

  // Solo para las pruebas
  private enrolledCoursesTemp = [
    {
      nombre: 'Estructuras de datos',
      dia: 'Miércoles',
      horaInicio: '1300',
      horaFin: '1500',
      profesor: 'Ivannia Cerdas'
    },
    {
      nombre: 'Análisis de Algoritmos',
      dia: 'Martes',
      horaInicio: '0900',
      horaFin: '1100',
      profesor: 'Rodrigo Núñez'
    },
    {
      nombre: 'Estructuras de datos',
      dia: 'Viernes',
      horaInicio: '1300',
      horaFin: '1500',
      profesor: 'Ivannia Cerdas'
    },
    {
      nombre: 'Análisis de Algoritmos',
      dia: 'Jueves',
      horaInicio: '0900',
      horaFin: '1100',
      profesor: 'Rodrigo Núñez'
    }
  ]





  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor() { }

  ngOnInit() {
/*     var events = [];
    events.push(this.event);
    this.eventSource = events; */


  }

}
