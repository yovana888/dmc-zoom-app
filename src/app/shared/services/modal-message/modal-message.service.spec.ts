import { ModalMessageService } from './modal-message.service';
import { skip, take } from 'rxjs/operators';

describe('@ModalMessageService', () => {
  let service: ModalMessageService;

  beforeEach(() => {
    service = new ModalMessageService();
  });

  describe('When service is initialized', () => {
    it('#Should have no active modal by default', (done) => {
      service.activeModal$.pipe(take(1)).subscribe((value) => {
        expect(value).toBeNull();
        done();
      });
    });
  });

  describe('When open is called', () => {
    it('#Should set the active modal id', (done) => {
      const modalId = 'modal-test';

      service.activeModal$.pipe(skip(1), take(1)).subscribe((value) => {
        expect(value).toBe(modalId);
        done();
      });

      service.open(modalId);
    });
  });

  describe('When close is called', () => {
    it('#Should clear the active modal', (done) => {
      const modalId = 'modal-test';

      service.open(modalId);

      service.activeModal$.pipe(skip(1), take(1)).subscribe((value) => {
        expect(value).toBeNull();
        done();
      });

      service.close();
    });
  });
});
