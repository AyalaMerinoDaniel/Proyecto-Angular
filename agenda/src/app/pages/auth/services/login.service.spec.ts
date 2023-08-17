import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from './login.service';
import { LoginResponseData } from '../models/login.model';
import { of } from 'rxjs';
import { apiUrl } from "src/app/environment/environmet-urls";
import { LocalstorageService } from 'src/app/services/localstorage.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;
  let localStorageService: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalstorageService);
  });

//   afterEach(() => {
//     httpMock.verify();
//   });

  it('Deberia crear el componente', () => {
    expect(service).toBeTruthy();
  });

  it('debe verificar el cierre de sesión automático correctamente', () => {
    spyOn(service['localStorageS'], 'getItem').and.returnValue(new Date().toString()); // Simulate a valid expiration date
  
    service.checkAutoLogout();
  
    // Add your expectations here
  });
  

  it('debe manejar el inicio de sesión con éxito', fakeAsync(() => {
    const email = 'test@example.com';
    const password = 'password';
    const mockResponse: LoginResponseData = { "succeed": true,
    "statusCode": 200,
    "code": 200,
    "result": {
      "accessToken": "12345678at",
      "refreshToken": "12345678rt",
      "expiresAt": new Date()
    },
    "message": "",
    "friendlyMessage": [""],
    "htmlMessage": "",
    "error": "",
    "created": new Date()};

    let response: LoginResponseData | undefined;
    service.login(email, password).subscribe(res => {
      response = res;
    });

    const req = httpTestingController.expectOne(apiUrl.baseUrl+'auth/login'); 
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    tick();
    expect(response).toEqual(mockResponse);
  }));


  it('deberia logout and navegar al login', fakeAsync(() => {
    const mockResponse1: LoginResponseData = {
        "succeed": true,
        "statusCode": 200,
        "code": 200,
        "result": {
            "accessToken": "",
            "refreshToken": "",
            "expiresAt": new Date()
        },
        "message": "Sesión cerrada.",
        "friendlyMessage": ["Sesión cerrada."],
        "htmlMessage": "",
        "error": "",
        "created": new Date()
};
    spyOn(service, 'logoutUser').and.returnValue(of(mockResponse1));

    // Mock the behavior of getItem in localStorageService
    spyOn(localStorageService, 'getItem').and.returnValue('fakeAccessToken');

    // Mock the behavior of router navigation
    const routerSpy = spyOn(service['router'], 'navigate');

    // Call the logout method
    service.logout();

    tick(); // Complete any pending asynchronous operations

    // Expectations
    expect(service.tokenExpirationTimer).toBeNull();
    expect(service['localStorageS'].getItem).toHaveBeenCalledWith('accessToken');
    expect(service.logoutUser).toHaveBeenCalledWith('fakeAccessToken');
    expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('Deberia Refrescar el token', fakeAsync(() => {
    service.newCurrentDateTime = new Date();
    service.newCurrentDateTime.setMinutes(service.newCurrentDateTime.getMinutes() + 2);
    const mockRefreshToken = 'mockRefreshToken';
    const mockResponse3: LoginResponseData = {
        "succeed": true,
        "statusCode": 200,
        "code": 200,
        "result": {
          "accessToken": "12345678at",
          "refreshToken": "12345678rt",
          "expiresAt": service.newCurrentDateTime
        },
        "message": "",
        "friendlyMessage": [""],
        "htmlMessage": "",
        "error": "",
        "created": new Date()
    
    };
    

    const refresh = spyOn(localStorageService, 'getItem').and.returnValue(mockRefreshToken);
    if(refresh){
        service.logout();
    }
    
    spyOn(service, 'refreshToken').and.returnValue(of(mockResponse3));
    service.refreshToken();
    let actualResponse: LoginResponseData;
    service.refreshToken().subscribe((response) => {
      actualResponse = response;
    });
    
     const expectedUrl = apiUrl.baseUrl + 'auth/refresh';
     const req = httpTestingController.expectOne(expectedUrl);
     expect(req.request.method).toBe('POST');
    
     req.flush(mockResponse3);
    
     tick();
    
    expect(actualResponse).toEqual(mockResponse3);
  }));

  it('debe manejar la autenticación correctamente', () => {
    const mockToken = 'mockAccessToken';
    const mockExpiresIn = new Date();
    const mockRefreshToken = 'mockRefreshToken';

    spyOn(service, 'autoLogout');
    spyOn(localStorageService, 'setItem');

    service['handleAuthentication'](mockToken, mockExpiresIn, mockRefreshToken);

    // Expectations
    expect(service.autoLogout).toHaveBeenCalledWith(mockExpiresIn);
    expect(localStorageService.setItem).toHaveBeenCalledWith('accessToken', mockToken);
    expect(localStorageService.setItem).toHaveBeenCalledWith('expiresDate', mockExpiresIn.toString());
    expect(localStorageService.setItem).toHaveBeenCalledWith('refreshToken', mockRefreshToken);
  });
  

  
});
