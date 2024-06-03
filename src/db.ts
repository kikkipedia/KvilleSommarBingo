//@ts-nocheck

import { db } from "./firebase.ts";
import { collection, addDoc } from "firebase/firestore";


const saveNewSheet = async (sheet) => {
  const docRef = await addDoc(collection(db, "bingoSheets"), {
    sheet
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

export { saveNewSheet };