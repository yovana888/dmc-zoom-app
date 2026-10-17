import { NumberValuesEnum } from '@core/enums/list/number.enum';

const HOST_ROLE = 'host';
const COLOR_A = 'var(--light-assents-accent3-primary)';
const COLOR_B = 'var(--light-wheel-soft)';
const LABEL_OFFSET = '3.5rem';

enum WheelTurnEnum {
  DEGREES = 360,
  RIGHT_ANGLE = 90,
}

export interface WheelAttendee {
  screenName: string;
  participantUUID: string;
  role: string;
}

export interface WheelSlice {
  name: string;
  tone: string;
  transform: string;
}

export function wheelNames(attendees: WheelAttendee[], teacherId: string): string[] {
  return attendees
    .filter((person): boolean => keepAttendee(person, teacherId))
    .map((person): string => person.screenName.trim())
    .filter((name): boolean => name.length > 0);
}

export function toSlices(names: string[]): WheelSlice[] {
  const slice = sliceAngle(names.length);
  return names.map((name, index): WheelSlice => ({
    name,
    tone: sliceTone(index),
    transform: labelTransform(centerAngle(index, slice)),
  }));
}

export function wheelBackground(count: number): string {
  if (count === 0) {
    return 'transparent';
  }

  const slice = sliceAngle(count);
  /* eslint-disable-next-line */
  const stops = Array.from({ length: count }, (_, index): string => colorStop(index, slice));
  return `conic-gradient(from -90deg, ${stops.join(', ')})`;
}

function keepAttendee(person: WheelAttendee, teacherId: string): boolean {
  if (person.role === HOST_ROLE) {
    return false;
  }

  return person.participantUUID !== teacherId;
}

function sliceAngle(count: number): number {
  if (count === 0) {
    return 0;
  }

  return WheelTurnEnum.DEGREES / count;
}

function centerAngle(index: number, slice: number): number {
  return (index + NumberValuesEnum.ONE / NumberValuesEnum.TWO) * slice;
}

function sliceTone(index: number): string {
  return index % NumberValuesEnum.TWO === 0 ? 'a' : 'b';
}

function colorStop(index: number, slice: number): string {
  const color = sliceTone(index) === 'a' ? COLOR_A : COLOR_B;
  const start = index * slice;
  const end = (index + NumberValuesEnum.ONE) * slice;
  return `${color} ${start}deg ${end}deg`;
}

function labelTransform(angle: number): string {
  return `rotate(${angle}deg) translateX(${LABEL_OFFSET}) rotate(${textAngle(angle)}deg)`;
}

function textAngle(angle: number): number {
  const normalized = angle % WheelTurnEnum.DEGREES;
  const upsideDown =
    normalized > WheelTurnEnum.RIGHT_ANGLE &&
    normalized < WheelTurnEnum.RIGHT_ANGLE * NumberValuesEnum.THREE;
  const extra = upsideDown ? WheelTurnEnum.DEGREES / NumberValuesEnum.TWO : 0;
  return WheelTurnEnum.RIGHT_ANGLE + extra;
}
