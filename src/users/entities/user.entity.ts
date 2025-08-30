export class User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  profile_picture_url: string;
  created_at: Date;
  updated_at: Date;
  daily_goal?: number;
  weekly_goal?: number;
}
