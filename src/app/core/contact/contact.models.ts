export interface ContactRequest {
  readonly nombre: string;
  readonly telefono: string;
  readonly email: string;
  readonly servicio: string;
  readonly mensaje: string;
  readonly website: string;
  readonly startedAt: number;
}

export interface ContactResponse {
  readonly ok: boolean;
}
