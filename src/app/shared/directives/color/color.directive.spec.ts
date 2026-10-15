import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorDirective } from './color.directive';

@Component({
  selector: 'app-color-host',
  imports: [ColorDirective],
  template: `<span appColor="--light-greyscale-icons">icon</span>`,
})
class ColorHostComponent {}

describe('ColorDirective', () => {
  let fixture: ComponentFixture<ColorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorHostComponent);
    fixture.detectChanges();
  });

  it('should apply the color token as a css variable', () => {
    const host = fixture.nativeElement.querySelector('span') as HTMLElement;

    expect(host.style.color).toBe('var(--light-greyscale-icons)');
  });
});
