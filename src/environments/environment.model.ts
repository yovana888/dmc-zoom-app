export interface ZoomEnvironment {
  clientId: string;
  redirectUri: string;
}

export interface AppEnvironment {
  production: boolean;
  apiMicroserviceIA: string;
  apiKey: string;
  zoom: ZoomEnvironment;
}
