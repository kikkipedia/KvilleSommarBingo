//a file with types for the project

export type BingoItem = {
    id: string;
    item: string;
    description: string;
    count: number;
    //maybe add array of coordinates seen?
    };

export type BingoSheet = {
  //id: string; needs to be returned from firebase
  name: string;
  items: BingoItem[];
  timeStarted: string;  
  bingo: boolean;
};

//add type User to keep track of times played and how many bingos?