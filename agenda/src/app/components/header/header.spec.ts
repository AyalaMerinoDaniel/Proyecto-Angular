import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/pages/auth/services/login.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';



describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalstorageService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let localStorageService: LocalstorageService;

  beforeEach(async () => {
    mockLocalStorageService = jasmine.createSpyObj('LocalstorageService', [
      'getItem'
    ]);
    mockLoginService = jasmine.createSpyObj('LoginService', ['logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        LocalstorageService,
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: mockRouter },
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.user = {
			"userId": 1,
			"userFullName": "Katrinka Hedon",
			"userName": "khedon0",
			"userPassword": "hidden",
			"userEmail": "khedon0@wix.com",
			"userPhoto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIwSURBVDjLlZLNS5RRFMafe9/3vjPOjI1jaKKEVH40tGgRBWEibfoPQoKkVdtoEQQF4T/QqkVtWrSTFrVsF1FgJbWpIAh1k2PNh+PrfL4f95zTQk0HHKkDD/cc7vP8uHCuEhF0q/KnmXNgGR248PZFN4/GISXMC8L89DBPV0Dp4/SsazJjrtfb9/vdxfn/BgjzY5M8Aq8nBya+V3h93vtnQHFxat4kszntJAAAxus1YvnZQV5V/jyTEZarwnwFLGeFZdT0ZFOJdD84qoCDOpQ7grZfRNj020JSEOKvwvxGiF+q0tL0N5PuO+Mk0nC0B0BDsYCCImyzAIktBBloMwKJLSgKYcMAcdhC2KpVlIig+H5qxcv0n0xmj4Gbq+BwC2wtJLbgHUlMEFJwUpMIGpto16u+kJzSACAk+WCzvNbe+AVljkOYIcQQou3TbvdOJo+g4aNdqzaF+PT43HJVA8DQpcVIiPPtaqlEUQzlDELsTpgYwgTAQIjQqlUCtpQfn1spdmxh+PJSQyw9CrbKgM7tvcISQAxlBhC3GuCYXk3cWP25m3M7dk88qbWBRDVApaATOSjPBdXXwYEP5QyCgvjE/kwHgInHtHYBnYA2owhrPiiuw0sOw3EZFEagIB7qChDiYaUcNIoFtP1KxCTPhWiDw7WbXk9vKpnOgsI4exjg6Mbq96YQPxm79uPOvqvbXx4O3KrF6w8osv2df17kr5YXJq7vnw/S0v3k7Ie7xtud/wAaRnP+Cw8iKQAAAABJRU5ErkJggg=="
		}

    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to user edit page on onEditUser()', () => {
    component.id = 1;
    component.onEditUser();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/', component.id, 'edit']);
  });

  it('should navigate to contacts page on onContacts()', () => {
    component.onContacts();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('should navigate to about us page on onAboutUs()', () => {
    component.onAboutUs();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/about/about']);
  });

  it('should logout on onLogout() with confirmation', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true , isDenied:false, isDismissed:false}));

    await component.onLogout();

    expect(mockLoginService.logout).toHaveBeenCalled();
  });

});
