import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar-grupo-admin',
  templateUrl: './agregar-grupo-admin.page.html',
  styleUrls: ['./agregar-grupo-admin.page.scss'],
})
export class AgregarGrupoAdminPage implements OnInit {

  public curso = {nombre : "", codigo: ""}

  constructor() { }

  ngOnInit() {
    var recibido = history.state
    this.curso.nombre = recibido.curso
    this.curso.codigo = recibido.codigo
    console.log(this.curso)
  }

}
