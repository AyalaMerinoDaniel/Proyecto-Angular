import {  async, ComponentFixture} from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModuleComponents } from 'src/app/components/contactsComponents.module';
import { ContactsModuleComponents } from '../../components/contactsComponents.module';
import { ContactsRoutingModule } from '../../contacts-routing.module';
import { ContactosListComponent } from './contactos-list.component';
import { ContactoService } from '../../services/contacto.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};


describe('ContactosListComponent', () => {
  let contactoService: jasmine.SpyObj<ContactoService>;
  let component: ContactosListComponent;
  let countContactsService: jasmine.SpyObj<CountContactsService>;
  let localStorageService: jasmine.SpyObj<LocalstorageService>;
  let fixture: ComponentFixture<ContactosListComponent>;
  let router: Router;

  beforeEach(async() => {
  const contactoServiceSpy = jasmine.createSpyObj('ContactoService', [
    'deleteContact',
    'storeContacts'
  ]);

  const localStorageServiceSpy = jasmine.createSpyObj('LocalstorageService', [
    'getItem',
    'setItem'
  ]);

  const countContactsServiceSpy = jasmine.createSpyObj('CountContactsService', [
    'countDecrement'
  ]);
  
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
        { provide: ContactoService, useValue: contactoServiceSpy },
        { provide: LocalstorageService, useValue: localStorageServiceSpy },
        { provide: CountContactsService, useValue: countContactsServiceSpy },
        { provide: Router, useValue: routerMock }
      ]
  }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosListComponent);
    component = fixture.componentInstance;
    contactoService = TestBed.inject(ContactoService) as jasmine.SpyObj<ContactoService>;
    localStorageService = TestBed.inject(LocalstorageService) as jasmine.SpyObj<LocalstorageService>;
    countContactsService = TestBed.inject(CountContactsService) as jasmine.SpyObj<CountContactsService>;
    router = TestBed.inject(Router);
  });


  it('should create ContactosListComponent', () => {
    expect(Component).toBeTruthy();
  });

  it('should load data correctly on page change', () => {
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
    const page = 2;
    const limit = 10;
    const offset = (page - 1) * limit;
    component.currentPage = 1;
    
    contactoService.storeContacts.and.returnValue(of(mockResponse));
    const newPage = 1;

    component.goToPage(page);

    // Expectations
    expect(component.currentPage).toEqual(newPage);
    expect(contactoService.storeContacts).toHaveBeenCalledWith(offset, limit);
    expect(component.contactos).toEqual(mockResponse.result.list);
  });

  it('Debe eliminar correctamente un contacto', async() => {
    const contactId = 1;
    component.isPopupVisible = true;
    component.exito = ["Usuario no autorizado"];
    const mockResponse = {
      succeed: false,
      statusCode: 401,
      code: 401,
      result: {},
      message: "",
      friendlyMessage: ["Usuario no autorizado"],
      htmlMessage: "",
      error: "Usuario no autorizado",
      created: new Date()
    }
    contactoService.deleteContact.and.returnValue(of(mockResponse));
    await component.onDeleteContacto(contactId);

    expect(component.isPopupVisible).toBeTrue();
    expect(contactoService.deleteContact).toHaveBeenCalledWith(contactId);
    expect(component.exito).toEqual(mockResponse.friendlyMessage);
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
   
});
