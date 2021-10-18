import { User } from './../models/user';
import { Student } from './../models/student';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  infoContacto: FormGroup;

  previewImage: string = 'assets/avatar.svg';
  profilePicture: File = null;

  user = {nombre: "Francisco Pereira Barrantes", cedula: "117010747", correo: '', student: true, telefono: ''};
  student = {carnet: 2017238806, fecha_nacimiento: '05/11/97', contacto_emergencia: '22414722', telefono: '87130523', codigo_plan: '321abc', sede: 'Cartago'};

  constructor(private fb: FormBuilder,
    private toastCtrl: ToastController) {}

  ngOnInit() {
    this.infoContacto = this.fb.group({
      contactoEmergencia: [null, [Validators.minLength(8), Validators.maxLength(12)]],
      telefonoPersonal: [null, [Validators.minLength(8), Validators.maxLength(12)]],
      correo: [null, Validators.email]
    });
  }

  onProfilePictureSelected(event){
    if (event.target.files){
      this.profilePicture = (event.target.files[0] as File);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
    }
  }

  guardarCambios() {
    this.user.correo = this.infoContacto.get('correo').value;
    this.student.contacto_emergencia = this.infoContacto.get('contactoEmergencia').value;
    this.user.telefono = this.infoContacto.get('telefonoPersonal').value;

    // Aquí enviar el User y Student a guardar nuevamente en la BDD
    // Los modelos que hicimos me parecieron un poco raros (el contacto de emergencia está en el objeto Student y el telefono está en el objeto User)
    // Podríamos considerar unirlos en uno solo o arreglar un poco eso del modelo en que va cada atributo...

  }

}
