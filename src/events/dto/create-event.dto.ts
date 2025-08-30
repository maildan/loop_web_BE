export class CreateEventDto {
  timestamp: Date;
  type: string;
  payload: Record<string, unknown>;
}
