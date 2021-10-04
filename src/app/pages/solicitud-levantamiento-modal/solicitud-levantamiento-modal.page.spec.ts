import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SolicitudLevantamientoModalPage } from './solicitud-levantamiento-modal.page';

describe('SolicitudLevantamientoModalPage', () => {
  let component: SolicitudLevantamientoModalPage;
  let fixture: ComponentFixture<SolicitudLevantamientoModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudLevantamientoModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudLevantamientoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
