import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.page.html',
  styleUrls: ['./enrollment.page.scss'],
})
export class EnrollmentPage implements OnInit {

  private cursos = [
    {
      id: "SE1103",
      name: "Danza",
      creditos: "0",
      grupos: [],
      mostrarGrupos: false

    },
    {
      id: "IC7602",
      name: "Redes",
      creditos: "4",
      grupos: [{id: "1", cupos: "20", teacher: "Carlos Benavides Villalobos"}, {id: "2", cupos: "25", teacher: "Esteban Arias Campos"}],
      mostrarGrupos: false
    },
    {
      id: "SE1107",
      name: "Cine",
      creditos: "0",
      grupos: [],
      mostrarGrupos: false
    }
  ]

  constructor(private courseService: CourseService, private groupService: GroupService) { }

  ngOnInit() {
  }

}
