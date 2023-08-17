import { ComponentFixture, TestBed , fakeAsync, tick} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactosDetailComponent } from './contactos-detail.component';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { ContactoService } from '../../services/contacto.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';
import { of } from 'rxjs';
import { apiUrl } from "src/app/environment/environmet-urls";
import { status } from 'src/app/enums/enum.enum';
import { throwError} from 'rxjs';

describe('ContactosDetailComponent', () => {
  let component: ContactosDetailComponent;
  let fixture: ComponentFixture<ContactosDetailComponent>;
  let httpTestingController: HttpTestingController;
  let mockActivatedRoute;
  let mockRouter;
  let mockLocalStorageS;
  let mockCountContactsService;
  let mockContactsService;
  let contactoService: ContactoService;

  const mockContacto = [{
        "contactFirstName": "Ardelia",
        "contactLastName": "Reichartz",
        "contactCompany": "Ntag",
        "contactBirthday": new Date(),
        "contactNotes": "United States Cellular Corporation",
        "contactAlias": "areichartz9",
        "contactPhoto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIZSURBVDjLpZPPS1RRGIafe+feSccfacxACUFYDGaKlEmrqFVEi6Bdy7YmLqL6A1oEtQiCglZBtYhKKqiEFiGRUERQthhEjKi0UNSbkk73zjnfd1pMM2VpBB64i8OFh/flOa/nnGMtx7tzoq3g1HnqHKoOVUXUIaqoOkTK9+PXJtpXAgSq6vV0dyALBuOKWJdgBVSUb0lAfWMDz1++XjVBIOKMiebC8x2P8DxwDqxV5qOY6aklLtOHFf0HQNUPvVpMSfB9D3WOg0MH8iqKqPJeF8k113G9d+vMCrVygRXFqvI1igkCv/xThJ1dbdgFQ5qI2CzheakVawXWKsYIM9NF/JSHqqMkvitFkde7Z5I6r4i1isukqQnWka1t5uRjrdYKrIjGkDo1eWi7U0fFxuh4RN/Y7zaKWdElxs7mZ0OdwIpUABoOjxTYlGvk/2y0YIxg7XgZ0H/jczvAzf58YqK59LH2e2wJN5Cx8MnAlZ4L7M5+5NWld1hRMnWGIFisVvArOio2Utmj3He7iC1kgSdf9rNoNhNqhBXhyMAoSRIj+gegYqOplKGrYZ6p5jzWv8tAoZuGW6cxpgVrlcGHbxgcfotIeQJBFfDTRseO9XTW91HDDCPfz5Ekt2lt2kZwsRz7zIP53LKH9CuBaAwcvjqFF87Sum8je+nkw7MJCF6QJFKNvQpA08MjBUQVEcfToeWjqnx/rXGtc/4BfOeC6F88S7oAAAAASUVORK5CYII=",
        "contactEmails": [],
        "contactTags": [],
        "contactPhones": []
  }
  ];

  beforeEach(() => {
   
    mockActivatedRoute = {
      params: of({ id: '0' }), // Simulate ActivatedRoute parameters
    };
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockLocalStorageS = jasmine.createSpyObj(['getItem']);
    mockCountContactsService = jasmine.createSpyObj(['countDecrement', 'getContadorObservable']);
    mockContactsService = jasmine.createSpyObj(['deleteContact']);

    TestBed.configureTestingModule({
      declarations: [ContactosDetailComponent],
      imports:[HttpClientTestingModule],
      providers: [
        ContactoService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: LocalstorageService, useValue: mockLocalStorageS },
        { provide: CountContactsService, useValue: mockCountContactsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactosDetailComponent);
    component = fixture.componentInstance;
    contactoService = TestBed.inject(ContactoService);
    httpTestingController = TestBed.inject(HttpTestingController);

    mockLocalStorageS.getItem.and.returnValue(mockContacto);
    mockCountContactsService.getContadorObservable.and.returnValue(of(5));

    fixture.detectChanges();
  });

  // afterEach(() => {
  //   httpTestingController.verify();
  // });

  it('deberia crear el componente contactos-detail', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener los datos de contacto en la inicialización del componente', () => {
    mockLocalStorageS.getItem.and.returnValue([mockContacto]); 
    component.ngOnInit();
    expect(mockLocalStorageS.getItem).toHaveBeenCalledWith('contactos');
    
  });

  it('Debe eliminar correctamente un contacto', async() => {
    const contactId = 1;
    component.isPopupVisible = true;
    component.exito = ["Usuario Eliminado Correctamente"];
    const mockResponse = {
      succeed: false,
      statusCode: 401,
      code: 401,
      result: {},
      message: "",
      friendlyMessage: ["Usuario Eliminado Correctamente"],
      htmlMessage: "",
      error: "Usuario no autorizado",
      created: new Date()
    }

    component.onDeleteContacto();
    contactoService.deleteContact(contactId).subscribe((data)=>{
      expect(data).toEqual(mockResponse);
    })

    expect(component.isPopupVisible).toBeTrue();
    const req = httpTestingController.expectOne(apiUrl.baseUrl+'contacts/delete/' + contactId); 
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
    expect(component.exito).toEqual(mockResponse.friendlyMessage);
  });

  it('deberia navegar a la pagina de editar contacto', async() => {
    component.id = 2;
    component.onEditContacto();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact/', 2, 'edit']);
  });

  it('debería mostrar una ventana emergente de confirmación y cancelar la solicitud', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);
    tick();
    expect(component.isPopupVisible).toBeFalse();
    expect(component.exito).toBeNull();
  }));

  it('deberia navegar a la pagina de la lista de contactos', async() => {
    component.onContacts();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact/contactos']);
  });

  it('should close the popup and navigate to /contact/contactos', () => {
    component.isPopupVisible = false;
    component.closePopup();

    // Assert
    expect(component.isPopupVisible).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact/contactos']);
  });
});







