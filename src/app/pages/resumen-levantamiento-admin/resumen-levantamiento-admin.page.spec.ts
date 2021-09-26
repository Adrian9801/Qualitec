import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResumenLevantamientoAdminPage } from './resumen-levantamiento-admin.page';

describe('ResumenLevantamientoAdminPage', () => {
  let component: ResumenLevantamientoAdminPage;
  let fixture: ComponentFixture<ResumenLevantamientoAdminPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenLevantamientoAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenLevantamientoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
