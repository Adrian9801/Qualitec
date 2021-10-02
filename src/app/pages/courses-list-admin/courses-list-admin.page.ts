import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-list-admin',
  templateUrl: './courses-list-admin.page.html',
  styleUrls: ['./courses-list-admin.page.scss'],
})
export class CoursesListAdminPage implements OnInit {
  public cursos = []
  public cursosAux = []

  constructor(private router: Router) { }

  ngOnInit() {
    this.cursos = [ {curso: 'Redes', codigo: 'IC7602'}, {curso: 'Estadistica',codigo: 'MA3405'}, 
    {curso: 'Inteligencia artificial',codigo: 'IC6200'}, {curso: 'Probabilidades',codigo: 'MA2404'},
    {curso: 'Ingles II',codigo: 'CI1231'}] , {curso: 'Actividad deportiva I',codigo: 'SE1200'}
    this.cursosAux = this.cursos
  }

  async filterList(evt) {
    this.cursos = this.cursosAux;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.cursos = this.cursos.filter(item => {
      if (item.curso && searchTerm) {
        return (item.curso.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
        || item.codigo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  seleccionado(curso){
    this.router.navigateByUrl('agregar-grupo-admin', { state: curso });
  }

}
