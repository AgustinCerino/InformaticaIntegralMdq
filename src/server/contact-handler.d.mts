import type { Request, Response } from 'express';

export interface ValidContactPayload {
  nombre: string;
  telefono: string;
  email: string;
  servicio: string;
  mensaje: string;
  bot: boolean;
}

export function validateContactPayload(body: unknown): ValidContactPayload | { bot: true } | null;
export function handleContactRequest(req: Request, res: Response): Promise<void>;
