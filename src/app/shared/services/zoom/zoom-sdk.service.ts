import { Injectable, computed, signal } from '@angular/core';
import zoomSdk, {
  ConfigResponse,
  GetMeetingContextResponse,
  GetUserContextResponse,
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

  readonly ready = this.readyState.asReadonly();
  readonly runningContext = this.runningContextState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly meeting = this.meetingState.asReadonly();
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
      await this.loadContexts();
    } catch {
      this.readyState.set(false);
    }
  }

  private configure(): Promise<ConfigResponse> {
    return zoomSdk.config({
      version: '0.16',
      capabilities: ZOOM_CAPABILITIES,
    });
  }

  private async loadContexts(): Promise<void> {
    await Promise.all([this.loadUser(), this.loadMeeting()]);
  }

  private async loadUser(): Promise<void> {
    try {
      this.userState.set(await zoomSdk.getUserContext());
    } catch {
      this.userState.set(null);
    }
  }

  private async loadMeeting(): Promise<void> {
    try {
      this.meetingState.set(await zoomSdk.getMeetingContext());
    } catch {
      this.meetingState.set(null);
    }
  }
}
