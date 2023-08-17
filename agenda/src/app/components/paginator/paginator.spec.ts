import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [PaginatorComponent],
      providers: [{ provide: NgxSpinnerService, useValue: mockSpinnerService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería aumentar la página actual y mostrar el spinner en la página siguiente', fakeAsync(() => {
    component.currentPage = 1;
    component.totalPages = 5;

    component.nextPage();
    expect(mockSpinnerService.show).toHaveBeenCalled();

    tick(2000);
    expect(component.currentPage).toBe(2);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  }));

  it('debería disminuir la página actual y mostrar el spinner en la página anterior', fakeAsync(() => {
    component.currentPage = 3;
    component.totalPages = 5;

    component.previousPage();
    expect(mockSpinnerService.show).toHaveBeenCalled();

    tick(2000);
    expect(component.currentPage).toBe(2);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  }));

  it('debe emitir el evento pageChange y mostrar el spinner en goToPage', fakeAsync(() => {
    component.currentPage = 3;
    component.totalPages = 5;
    const page = 4;

    const pageChangeSpy = spyOn(component.pageChange, 'emit');
    component.goToPage(page);
    expect(pageChangeSpy).toHaveBeenCalledWith(page);

    tick(2000);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  }));

  it('debería actualizar las paginas', () => {
    component.currentPage = 3;
    component.totalPages = 10;
    component.visiblePages = 5;

    const visiblePagesArray = component.visiblePagesArray;
    expect(visiblePagesArray).toEqual([1, 2, 3, 4, 5]);
  });
});
