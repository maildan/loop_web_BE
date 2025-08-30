export class Event {
  id: number;
  user_id: string;
  timestamp: Date;
  type: string;
  payload: Record<string, unknown>;
  created_at: Date;
}
