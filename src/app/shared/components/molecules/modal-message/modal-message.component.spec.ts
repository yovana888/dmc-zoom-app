import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalMessageComponent } from './modal-message.component';
import { ModalMessageService } from '@shared/services/modal-message/modal-message.service';

describe('@ModalMessageComponent', () => {
  let component: ModalMessageComponent;
  let fixture: ComponentFixture<ModalMessageComponent>;
  let modalService: ModalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalMessageComponent],
      providers: [ModalMessageService],
    });

    fixture = TestBed.createComponent(ModalMessageComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalMessageService);
    fixture.componentRef.setInput('id', 'modal-test');
    fixture.detectChanges();
  });

  describe('When component is initialized', () => {
    it('#Should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When modal service emits open', () => {
    it('#Should show the dialog', () => {
      modalService.open('modal-test');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.modal.show')).toBeTruthy();
    });
  });

  describe('When modal service emits close', () => {
    it('#Should hide the dialog', () => {
      modalService.open('modal-test');
      modalService.close();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.modal.show')).toBeFalsy();
    });
  });

  describe('When close button is clicked', () => {
    it('#Should emit clickButtonClose event', () => {
      fixture.componentRef.setInput('nameButtonClose', 'Cancelar');
      fixture.detectChanges();
      const emitSpy = jest.spyOn(component.clickButtonClose, 'emit');

      fixture.nativeElement.querySelector(`#${component.id()}-btn-close button`).click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('When action button is clicked', () => {
    it('#Should emit clickButtonAction event', () => {
      const emitSpy = jest.spyOn(component.clickButtonAction, 'emit');

      fixture.nativeElement.querySelector(`#${component.id()}-btn-action button`).click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
