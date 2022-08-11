export type Attack = {
  name: string;
}

export interface MokeponType {
  id: string;
  name: string;
  img: string;
  mini: string;
  attacks: Attack[];
}

export interface Response {
  message: string;
  status: string;
  statusCode: number;
}