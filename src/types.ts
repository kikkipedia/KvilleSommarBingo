//a file with types for the project

export type BingoItem = {
    id: string;
    item: string;
    description: string;
    count: number;
    isChecked: boolean;
    //location: {latitude: number, longitude: number, _lat: number, _long: number};

    };

export type BingoSheet = {
  //id: string; //needs to be returned from firebase
  name: string;
  items: BingoItem[];
  timeStarted: string;  
  bingo: boolean;
};

export type User = {
  id: string;
  name: string;
  score: number;
};

export type Team = {
  id: string;
  members: User[];
  points: number;
};

export type Flag = {
  id: string;
  item: string;
  location: {latitude: number, longitude: number, _lat: number, _long: number};
  team: string;
  name: string;
  adress: string;
};

