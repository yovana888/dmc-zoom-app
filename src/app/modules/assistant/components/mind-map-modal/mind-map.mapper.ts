/* eslint-disable @typescript-eslint/naming-convention */
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { ConnectorModel, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { MindMap, MindNode } from '../../infrastructure/domain/interfaces/final-kit.interface';

const ROOT_ID = 'root';
const ROOT_BRANCH = 'Root';
const LEFT_BRANCH = 'Left';
const RIGHT_BRANCH = 'Right';

export interface MindDiagram {
  nodes: NodeModel[];
  connectors: ConnectorModel[];
}

interface MindInfo {
  orientation: string;
}

interface ConceptLink {
  branchId: string;
  concept: string;
  conceptIndex: number;
  orientation: string;
}

export function toMindDiagram(map: MindMap): MindDiagram {
  const nodes: NodeModel[] = [mindNode(ROOT_ID, map.tema, ROOT_BRANCH)];
  const connectors: ConnectorModel[] = [];
  map.ramas.forEach((branch, index): void => {
    appendBranch(nodes, connectors, branch, index);
  });
  return { nodes, connectors };
}

export function branchOf(node: NodeModel): string {
  const info = node.addInfo as MindInfo | undefined;
  return info?.orientation ?? LEFT_BRANCH;
}

export function isMindRoot(node: NodeModel): boolean {
  return node.id === ROOT_ID;
}

function appendBranch(
  nodes: NodeModel[],
  connectors: ConnectorModel[],
  branch: MindNode,
  index: number,
): void {
  const branchId = `rama-${index}`;
  const orientation = sideOf(index);
  nodes.push(mindNode(branchId, branch.titulo, orientation));
  connectors.push(mindLink(ROOT_ID, branchId));
  branch.conceptos.forEach((concept, conceptIndex): void => {
    appendConcept(nodes, connectors, { branchId, concept, conceptIndex, orientation });
  });
}

function appendConcept(nodes: NodeModel[], connectors: ConnectorModel[], link: ConceptLink): void {
  const conceptId = `${link.branchId}-${link.conceptIndex}`;
  nodes.push(mindNode(conceptId, link.concept, link.orientation));
  connectors.push(mindLink(link.branchId, conceptId));
}

function sideOf(index: number): string {
  const even = index % NumberValuesEnum.TWO === 0;
  return even ? LEFT_BRANCH : RIGHT_BRANCH;
}

function mindNode(id: string, content: string, orientation: string): NodeModel {
  return {
    id,
    annotations: [{ content }],
    addInfo: { orientation },
  };
}

function mindLink(sourceId: string, targetId: string): ConnectorModel {
  return {
    id: `link-${targetId}`,
    sourceID: sourceId,
    targetID: targetId,
  };
}
