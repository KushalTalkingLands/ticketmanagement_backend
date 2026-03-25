import { IsEnum } from 'class-validator';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  // Optional technician fields can be validated later if needed
  technicianName?: string;
  technicianAvatar?: string;
}

