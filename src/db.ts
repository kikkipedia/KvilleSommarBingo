//@ts-nocheck

import { db } from "./firebase.ts";
import { collection, addDoc, getDocs, getDoc } from "firebase/firestore";

const getBingoItems = async () => {
  const itemsArray = [];
  const querySnapshot = await getDocs(collection(db, "bingoItems"));
  querySnapshot.forEach((doc) => {
    const addId = { ...doc.data(), id: doc.id };
    itemsArray.push(addId);
  });
  return itemsArray;
}


const saveNewSheetToDb = async (sheet) => {
  console.log(sheet)
  const docRef = await addDoc(collection(db, "bingoSheets"), {
    sheet
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

const saveNewUser = async (name) => {
  const docRef = await addDoc(collection(db, "users"), {
    user: {
      name: name,
      score: 0   
    }
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

const fetchUserById = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

export { saveNewSheetToDb, saveNewUser, fetchUserById, getBingoItems };