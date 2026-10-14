import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypographyComponent } from './typography.component';

@Component({
  selector: 'app-typography-host',
  imports: [TypographyComponent],
  template: `
    <app-typography size="lg" weight="extrabold" color="--light-assents-accent1-primary">
      Zoom
    </app-typography>
  `,
})
class TypographyHostComponent {}

describe('TypographyComponent', () => {
  let fixture: ComponentFixture<TypographyHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypographyHostComponent);
    fixture.detectChanges();
  });

  it('should project content and apply size, weight and color', () => {
    const host = fixture.nativeElement.querySelector('app-typography') as HTMLElement;

    expect(host.textContent).toContain('Zoom');
    expect(host.getAttribute('data-size')).toBe('lg');
    expect(host.getAttribute('data-weight')).toBe('extrabold');
    expect(host.style.color).toBe('var(--light-assents-accent1-primary)');
  });
});
