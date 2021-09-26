import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaLevantamamientoAdminPage } from './lista-levantamamiento-admin.page';

describe('ListaLevantamamientoAdminPage', () => {
  let component: ListaLevantamamientoAdminPage;
  let fixture: ComponentFixture<ListaLevantamamientoAdminPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLevantamamientoAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaLevantamamientoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
