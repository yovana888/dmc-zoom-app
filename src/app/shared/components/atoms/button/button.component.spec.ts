import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { phosphorWarehouseBold } from '@ng-icons/phosphor-icons/bold';
import { phosphorPlus } from '@ng-icons/phosphor-icons/regular';
import { ButtonComponent } from './button.component';
import { ButtonIcon, ButtonSize, ButtonVariant } from './button.type';

@Component({
  selector: 'app-button-host',
  imports: [ButtonComponent],
  template: `
    <app-button
      [variant]="variant"
      [size]="size"
      [icon]="icon"
      [iconName]="iconName"
      [full]="full"
      [disabled]="disabled"
    >
      Action
    </app-button>
  `,
})
class ButtonHostComponent {
  variant: ButtonVariant = 'primary';
  size: ButtonSize = 'lg';
  icon: ButtonIcon = 'none';
  iconName = '';
  full = false;
  disabled = false;
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonHostComponent>;
  let host: ButtonHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should project the label and apply variant and size', () => {
    const button = buttonElement();

    expect(button.textContent).toContain('Action');
    expect(button.getAttribute('data-variant')).toBe('primary');
    expect(button.getAttribute('data-size')).toBe('lg');
    expect(button.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('ng-icon')).toBeNull();
  });

  it('should render the named Phosphor icon on the left', () => {
    host.icon = 'left';
    host.iconName = phosphorPlus;
    host.variant = 'secondary';
    host.size = 'sm';
    fixture.detectChanges();

    const button = buttonElement();
    const icon = iconComponent();

    expect(button.getAttribute('data-variant')).toBe('secondary');
    expect(button.getAttribute('data-size')).toBe('sm');
    expect(icon.svg()).toBe(phosphorPlus);
    expect(icon.size()).toBe('1rem');
    expect(button.firstElementChild?.tagName.toLowerCase()).toBe('ng-icon');
  });

  it('should render the named Phosphor icon on the right', () => {
    host.icon = 'right';
    host.iconName = phosphorWarehouseBold;
    host.size = 'xs';
    fixture.detectChanges();

    const button = buttonElement();
    const icon = iconComponent();

    expect(icon.svg()).toBe(phosphorWarehouseBold);
    expect(icon.size()).toBe('1rem');
    expect(button.lastElementChild?.tagName.toLowerCase()).toBe('ng-icon');
  });

  it('should stretch the host and the button when full is set', () => {
    host.full = true;
    fixture.detectChanges();

    const buttonHost = fixture.nativeElement.querySelector('app-button') as HTMLElement;

    expect(buttonHost.getAttribute('data-full')).toBe('true');
    expect(buttonElement().getAttribute('data-full')).toBe('true');
  });

  it('should disable the native button', () => {
    host.disabled = true;
    host.variant = 'tertiary';
    fixture.detectChanges();

    expect(buttonElement().disabled).toBe(true);
  });

  function buttonElement(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  function iconComponent(): NgIcon {
    return fixture.debugElement.query(By.directive(NgIcon)).componentInstance as NgIcon;
  }
});
