import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public student = true;
  constructor() { 
  }

  setStudent(valor:boolean){
    this.student = valor;
  }
}
