import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'enrollment',
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


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
