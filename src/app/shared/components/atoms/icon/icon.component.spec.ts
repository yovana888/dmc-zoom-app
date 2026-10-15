import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { phosphorHourglassMediumThin } from '@ng-icons/phosphor-icons/thin';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-icon-host',
  imports: [IconComponent],
  template: `
    <app-icon [icon]="icon" [size]="size" [color]="color" [strokeWidth]="strokeWidth" />
  `,
})
class IconHostComponent {
  icon = phosphorHourglassMediumThin;
  size: string | undefined = '2rem';
  color: string | undefined = 'var(--brand)';
  strokeWidth: string | number | undefined = '1.5';
}

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHostComponent);
    fixture.detectChanges();
  });

  it('should render the svg passed by the parent', () => {
    const icon = fixture.debugElement.query(By.directive(NgIcon)).componentInstance as NgIcon;

    expect(icon.svg()).toBe(phosphorHourglassMediumThin);
    expect(icon.size()).toBe('2rem');
    expect(icon.color()).toBe('var(--brand)');
    expect(icon.strokeWidth()).toBe('1.5');
  });
});
