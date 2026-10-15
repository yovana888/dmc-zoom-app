import { ChangeDetectionStrategy, Component, effect, input, viewChild } from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import {
  ConnectorModel,
  DiagramComponent,
  DiagramModule,
  DiagramTools,
  LayoutModel,
  MindMapService,
  NodeModel,
  ScrollSettingsModel,
  SnapConstraints,
  SnapSettingsModel,
} from '@syncfusion/ej2-angular-diagrams';
import { ModalMessageComponent } from '@shared/components/molecules/modal-message/modal-message.component';
import { branchOf, isMindRoot } from './mind-map.mapper';

export const MIND_MAP_MODAL_ID = 'mind-map';

@Component({
  selector: 'app-mind-map-modal',
  templateUrl: './mind-map-modal.component.html',
  styleUrl: './mind-map-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalMessageComponent, DiagramModule],
  providers: [MindMapService],
})
export class MindMapModalComponent {
  readonly nodes = input<NodeModel[]>([]);
  readonly connectors = input<ConnectorModel[]>([]);
  readonly message = input('');

  private readonly diagram = viewChild<DiagramComponent>('diagram');
  private fitted = false;

  protected readonly modalId = MIND_MAP_MODAL_ID;
  protected readonly tool = DiagramTools.ZoomPan;
  protected readonly layout: LayoutModel = {
    type: 'MindMap',
    orientation: 'Horizontal',
    horizontalSpacing: NumberValuesEnum.FIFTY,
    verticalSpacing: NumberValuesEnum.THIRTY,
    getBranch: (node: NodeModel): string => branchOf(node),
  };
  protected readonly scrollSettings: ScrollSettingsModel = { scrollLimit: 'Infinity' };
  protected readonly snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
  protected readonly nodeDefaults = (node: NodeModel): NodeModel => this.styleNode(node);
  protected readonly connectorDefaults = (connector: ConnectorModel): ConnectorModel =>
    this.styleConnector(connector);

  constructor() {
    effect((): void => {
      this.nodes();
      this.fitted = false;
    });
  }

  protected fitDiagram(): void {
    const diagram = this.diagram();
    if (this.fitted || !diagram) {
      return;
    }

    this.fitted = true;
    diagram.fitToPage();
  }

  private styleNode(node: NodeModel): NodeModel {
    const root = isMindRoot(node);
    node.width = NumberValuesEnum.TWO_HUNDRED;
    node.height = NumberValuesEnum.SIXTY;
    node.style = { fill: this.fillOf(root), strokeColor: 'var(--light-visual-mind)' };
    this.styleLabel(node, root);
    return node;
  }

  private fillOf(root: boolean): string {
    return root ? 'var(--light-visual-mind)' : 'var(--light-greyscale-white)';
  }

  private styleLabel(node: NodeModel, root: boolean): void {
    const label = node.annotations?.[0];
    if (!label) {
      return;
    }

    label.style = {
      color: root ? 'var(--light-greyscale-white)' : 'var(--light-greyscale-text-primary)',
    };
  }

  private styleConnector(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Bezier';
    connector.style = {
      strokeColor: 'var(--light-visual-mind)',
      strokeWidth: NumberValuesEnum.TWO,
    };
    connector.targetDecorator = { shape: 'None' };
    return connector;
  }
}
