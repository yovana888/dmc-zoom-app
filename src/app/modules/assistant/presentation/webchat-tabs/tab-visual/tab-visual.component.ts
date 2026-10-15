import { ChangeDetectionStrategy, Component } from '@angular/core';

interface VisualChip {
  label: string;
  tone: 'mind' | 'flash' | 'quiz';
}

@Component({
  selector: 'app-tab-visual',
  templateUrl: './tab-visual.component.html',
  styleUrl: './tab-visual.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabVisualComponent {
  protected readonly chips: VisualChip[] = [
    { label: 'Mapa mental', tone: 'mind' },
    { label: 'FlashCard', tone: 'flash' },
    { label: 'Cuestionario', tone: 'quiz' },
  ];
}
