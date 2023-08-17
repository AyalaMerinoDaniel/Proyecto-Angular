import {  async, ComponentFixture, tick, fakeAsync} from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ModuleComponents } from 'src/app/components/contactsComponents.module';
import { ContactsModuleComponents } from '../../components/contactsComponents.module';
import { ContactsRoutingModule } from '../../contacts-routing.module';
import { ContactosListComponent } from './contactos-list.component';
import { ContactoService } from '../../services/contacto.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from "src/app/environment/environmet-urls";
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';
import Swal from 'sweetalert2';

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

const mockResponse={
  succeed: true,
  statusCode: 200,
  code: 200,
  result: {
      list: [
          {
              "contactId": 1,
              "contactFirstName": "Ardelia",
              "contactLastName": "Reichartz",
              "contactCompany": "Ntag",
              "contactBirthday": new Date(),
              "contactNotes": "United States Cellular Corporation",
              "contactAlias": "areichartz9",
              "contactPhoto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIZSURBVDjLpZPPS1RRGIafe+feSccfacxACUFYDGaKlEmrqFVEi6Bdy7YmLqL6A1oEtQiCglZBtYhKKqiEFiGRUERQthhEjKi0UNSbkk73zjnfd1pMM2VpBB64i8OFh/flOa/nnGMtx7tzoq3g1HnqHKoOVUXUIaqoOkTK9+PXJtpXAgSq6vV0dyALBuOKWJdgBVSUb0lAfWMDz1++XjVBIOKMiebC8x2P8DxwDqxV5qOY6aklLtOHFf0HQNUPvVpMSfB9D3WOg0MH8iqKqPJeF8k113G9d+vMCrVygRXFqvI1igkCv/xThJ1dbdgFQ5qI2CzheakVawXWKsYIM9NF/JSHqqMkvitFkde7Z5I6r4i1isukqQnWka1t5uRjrdYKrIjGkDo1eWi7U0fFxuh4RN/Y7zaKWdElxs7mZ0OdwIpUABoOjxTYlGvk/2y0YIxg7XgZ0H/jczvAzf58YqK59LH2e2wJN5Cx8MnAlZ4L7M5+5NWld1hRMnWGIFisVvArOio2Utmj3He7iC1kgSdf9rNoNhNqhBXhyMAoSRIj+gegYqOplKGrYZ6p5jzWv8tAoZuGW6cxpgVrlcGHbxgcfotIeQJBFfDTRseO9XTW91HDDCPfz5Ekt2lt2kZwsRz7zIP53LKH9CuBaAwcvjqFF87Sum8je+nkw7MJCF6QJFKNvQpA08MjBUQVEcfToeWjqnx/rXGtc/4BfOeC6F88S7oAAAAASUVORK5CYII=",
              "contactEmails": [
                  {
                      "emailId": 1,
                      "emailValue": "kbreslauer0@github.io"
                  }
              ],
              "contactTags": [
                  {
                      "tagId": 1,
                      "tagValue": "Transcof"
                  }
              ],
              "contactPhones": [
                  {
                      "phoneId": 1,
                      "phoneValue": "3397815680",
                      "phoneType": "whatsapp"
                  }
              ]
          }
      ],
      count: 1
  },
  message: "Contacts Data.",
  friendlyMessage: ["Listado de Contactos Exitoso."],
  error: "",
  created: new Date()
}


describe('ContactosListComponent', () => {
  let contactoService: ContactoService;
  let component: ContactosListComponent;
  let fixture: ComponentFixture<ContactosListComponent>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let mockLocalStorageService: jasmine.SpyObj<LocalstorageService>;
  let mockContactoService: jasmine.SpyObj<ContactoService>;
  let mockCountContactsService: jasmine.SpyObj<CountContactsService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    mockLocalStorageService = jasmine.createSpyObj('LocalstorageService', ['setItem']);
    mockContactoService = jasmine.createSpyObj('ContactoService', ['deleteContact', 'storeContacts']);
    mockCountContactsService = jasmine.createSpyObj('CountContactsService', ['countDecrement']);
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

  await TestBed.configureTestingModule({
    declarations: [ContactosListComponent],
    imports:[HttpClientTestingModule,
      RouterTestingModule,
      NgxSpinnerModule.forRoot(),
      CommonModule,
      ReactiveFormsModule,
      ContactsRoutingModule,
      FormsModule,
      NgxPaginationModule, 
      ContactsModuleComponents,
      ModuleComponents],
      providers:[ 
        ContactoService,
        { provide: Router, useValue: routerMock },
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: CountContactsService, useValue: mockCountContactsService }
      ]
  });
  contactoService = TestBed.inject(ContactoService);
  fixture = TestBed.createComponent(ContactosListComponent);
  component = fixture.componentInstance;
  router = TestBed.inject(Router);
  httpTestingController = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   httpTestingController.verify();
  // });


  it('Debe Crear el componentente "Contacts-list"', () => {
    expect(Component).toBeTruthy();
  });

  it('should load data and update properties correctly', fakeAsync(() => {
    const page = 2;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    spyOn(contactoService, 'storeContacts').and.returnValue(of(mockResponse));
    contactoService.storeContacts(offset,limit).subscribe((data)=>{
      expect(data).toEqual(mockResponse);
    });
    
    component.currentPage = 1;
    component.totalPagesArray = [1]; 
    component.totalPages = 5;
    

    component.loadData();
    tick();
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('contactos', component.contactos);
    expect(component.totalPages).toBe(Math.ceil(mockResponse.result.count / limit));
    expect(component.totalPagesArray).toEqual(Array.from({ length: component.totalPages }, (_, index) => index + 1));
  }));
  
  
  

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
    component.onDeleteContacto(contactId);
    contactoService.deleteContact(contactId).subscribe((data)=>{
      expect(data).toEqual(mockResponse);
      expect(component.exito).toEqual(data.friendlyMessage);
    })
   
    expect(component.isPopupVisible).toBeTrue();
    
    const req = httpTestingController.expectOne(apiUrl.baseUrl+'contacts/delete/' + contactId); 
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should decrement count and show popup on confirm', async () => {
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
    mockContactoService.deleteContact.and.returnValue(of(mockResponse));
  
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
  
    await component.onDeleteContacto(1);
    
    expect(mockCountContactsService.countDecrement).toHaveBeenCalled();
    // expect(contactoService.deleteContact).toHaveBeenCalledWith(1);
    expect(component.exito).toEqual(mockResponse.friendlyMessage);
    expect(component['isPopupVisible']).toBe(true);
  });

  it('Debe navegar a la pagina de nuevo contacto', () => {
    component.onNewContacto();
    expect(router.navigate).toHaveBeenCalledWith(['/contact/new']);
  });

  it('Debe navegar a la pagina de detalles con el id 1', () => {
    const contactId = 1;
    component.onDetail(contactId);
    expect(router.navigate).toHaveBeenCalledWith(['/contact/detail', contactId]);
  });

  it('should handle missing subscription and timer on ngOnDestroy', () => {
    component.ngOnDestroy();

    expect(component.subscription).toBeFalsy();
    expect(component.subscription2).toBeFalsy();
    expect(component.pageTimer).toBeFalsy();
  });
  
   it('should update currentPage and load data when page is valid',fakeAsync (() => {
     component.totalPages = 5; 
     const page = 1;
     spyOn(component, 'loadData');

     
     component.goToPage(page);

     expect(mockSpinnerService.show).toHaveBeenCalled();
     expect(component.currentPage).toBe(page);
     tick(2000);
     expect(mockSpinnerService.hide).toHaveBeenCalled();
     clearTimeout(component.pageTimer); 
    }));
 
    it('should close the popup', () => {
      component.isPopupVisible = false;
      component.closePopup();
  
      expect(component.isPopupVisible).toBeFalse();
    
    });
   
});
