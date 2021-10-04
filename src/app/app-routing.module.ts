import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'enrollment',
    loadChildren: () => import('./pages/enrollment/enrollment.module').then( m => m.EnrollmentPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'account-details',
    loadChildren: () => import('./pages/account-details/account-details.module').then( m => m.AccountDetailsPageModule)
  },
  {
    path: 'add-course',
    loadChildren: () => import('./pages/add-course/add-course.module').then( m => m.AddCoursePageModule)
  },
  {
    path: 'data-verification',
    loadChildren: () => import('./pages/data-verification/data-verification.module').then( m => m.DataVerificationPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'enrollment-control',
    loadChildren: () => import('./pages/enrollment-control/enrollment-control.module').then( m => m.EnrollmentControlPageModule)
  },
  {
    path: 'group-settings',
    loadChildren: () => import('./pages/group-settings/group-settings.module').then( m => m.GroupSettingsPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'home-student',
    loadChildren: () => import('./pages/home-student/home-student.module').then( m => m.HomeStudentPageModule)
  },
  {
    path: 'account-recovery',
    loadChildren: () => import('./pages/account-recovery/account-recovery.module').then( m => m.AccountRecoveryPageModule)
  },
  {
    path: 'lista-levantamamiento-admin',
    loadChildren: () => import('./pages/lista-levantamamiento-admin/lista-levantamamiento-admin.module').then( m => m.ListaLevantamamientoAdminPageModule)
  },
  {
    path: 'resumen-levantamiento-admin',
    loadChildren: () => import('./pages/resumen-levantamiento-admin/resumen-levantamiento-admin.module').then( m => m.ResumenLevantamientoAdminPageModule)
  },
  {
    path: 'control-matricula-admin',
    loadChildren: () => import('./pages/control-matricula-admin/control-matricula-admin.module').then( m => m.ControlMatriculaAdminPageModule)
  },
  {
    path: 'courses-list-admin',
    loadChildren: () => import('./pages/courses-list-admin/courses-list-admin.module').then( m => m.CoursesListAdminPageModule)
  },
  {
    path: 'agregar-grupo-admin',
    loadChildren: () => import('./pages/agregar-grupo-admin/agregar-grupo-admin.module').then( m => m.AgregarGrupoAdminPageModule)
  },
  {
    path: 'solicitud-levantamiento-modal',
    loadChildren: () => import('./pages/solicitud-levantamiento-modal/solicitud-levantamiento-modal.module').then( m => m.SolicitudLevantamientoModalPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
