export type UserLoginRequest = {
  name: string;
  password: string;
};

export type UserRegisterRequest = UserLoginRequest & {
  team_id?: number;
};

export type UserInfo = {
  id: number;
  name: string;
  team_id: number;
  role: string;
};

export type ReferenceType = {
  id: number;
  name: string;
};

export type TeamInfo = {
  id: number;
  name: string;
};

export type InterviewDetailType = {
  id: number;
  user_id: number;
  name: string;
  date: string;
  duration: number;
  path: string;
};

export type UpdatePaswordRequest = {
  user_id: number;
  old_password: string;
  new_password: string;
};

export type ResetPaswordRequest = {
  user_id: number;
};
