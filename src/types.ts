//a file with types for the project

export type BingoItem = {
    id: string;
    title: string;
    description: string;
    checked: boolean;
    totalchecks: number;
    //maybe add array of coordinates seen?
    };

export type BingoSheet = {
  id: string;
  name: string;
  items: BingoItem[];
  timeStarted: number;  
  bingo: boolean;
};

//add type User to keep track of times played and how many bingos?