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

export interface Position {
  id: string;
  mokepon: string;
  afk: boolean;
  x: number;
  y: number;
}