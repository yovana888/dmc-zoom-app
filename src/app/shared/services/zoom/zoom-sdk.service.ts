import { Injectable, computed, signal } from '@angular/core';
import zoomSdk, {
  ConfigResponse,
  GetMeetingContextResponse,
  GetUserContextResponse,
  Participant,
  RunningContext,
} from '@zoom/appssdk';
import { environment } from '@environments/environment';
import { ZOOM_CAPABILITIES } from './zoom-capabilities';

@Injectable({ providedIn: 'root' })
export class ZoomSdkService {
  private readonly readyState = signal(false);
  private readonly runningContextState = signal<RunningContext | null>(null);
  private readonly userState = signal<GetUserContextResponse | null>(null);
  private readonly meetingState = signal<GetMeetingContextResponse | null>(null);
  private readonly meetingUuidState = signal<string | null>(null);

  private readonly diagnosticsState = signal<string[]>([]);

  readonly diagnostics = this.diagnosticsState.asReadonly();
  readonly ready = this.readyState.asReadonly();
  readonly runningContext = this.runningContextState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly meeting = this.meetingState.asReadonly();
  readonly meetingUuid = this.meetingUuidState.asReadonly();
  readonly authorizeUrl = computed((): string => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: environment.zoom.clientId,
      redirect_uri: environment.zoom.redirectUri,
    });
    /* eslint-disable @typescript-eslint/naming-convention */

    return `https://zoom.us/oauth/authorize?${params.toString()}`;
  });

  async connect(): Promise<void> {
    try {
      const config = await this.configure();

      this.runningContextState.set(config.runningContext);
      this.readyState.set(true);
      this.diagnosticsState.update((lines) => [
        ...lines,
        `config OK, contexto: ${config.runningContext}`,
        `APIs no soportadas: ${JSON.stringify(config.unsupportedApis ?? [])}`,
      ]);
      await this.loadContexts();
    } catch (error: unknown) {
      this.report('config', error);
      this.readyState.set(false);
    }
  }

  private report(step: string, error: unknown): void {
    console.error(`[zoom] ${step} failed`, error);
    const detail = error instanceof Error ? error.message : JSON.stringify(error);
    this.diagnosticsState.update((lines) => [...lines, `${step} falló: ${detail}`]);
  }

  async listParticipants(): Promise<Participant[]> {
    try {
      const response = await zoomSdk.getMeetingParticipants();
      return response.participants;
    } catch {
      return [];
    }
  }

  private configure(): Promise<ConfigResponse> {
    return zoomSdk.config({
      version: '0.16',
      capabilities: ZOOM_CAPABILITIES,
    });
  }

  private async loadContexts(): Promise<void> {
    await Promise.all([this.loadUser(), this.loadMeeting(), this.loadMeetingUuid()]);
  }

  private async loadUser(): Promise<void> {
    try {
      this.userState.set(await zoomSdk.getUserContext());
    } catch (error: unknown) {
      this.report('getUserContext', error);
      this.userState.set(null);
    }
  }

  private async loadMeeting(): Promise<void> {
    try {
      this.meetingState.set(await zoomSdk.getMeetingContext());
    } catch (error: unknown) {
      this.report('getMeetingContext', error);
      this.meetingState.set(null);
    }
  }

  private async loadMeetingUuid(): Promise<void> {
    try {
      const context = await zoomSdk.getMeetingUUID();
      this.meetingUuidState.set(context.parentUUID || context.meetingUUID);
    } catch (error: unknown) {
      this.report('getMeetingUUID', error);
      this.meetingUuidState.set(null);
    }
  }
}
