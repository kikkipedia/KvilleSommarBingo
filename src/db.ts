//@ts-nocheck

import { db } from "./firebase.ts";
import { collection, addDoc, getDocs, getDoc, setDoc, doc } from "firebase/firestore";

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
  const docRef = await addDoc(collection(db, "bingoSheets"), {
    sheet
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

const updateSheetInDb = async (sheet, id) => {
  const docRef = doc(db, "bingoSheets", id);
  await setDoc(docRef, {
    sheet
  });
  console.log("Document updated with ID: ", docRef.id);
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



//TODO test this function
const updateBingoItemCount = async (id) => {
  const docRef = doc(db, "bingoItems", id);
  let countBefore = await getDoc(docRef);
  countBefore = countBefore.data().count;
  const newCount = countBefore + 1;
 //update only one field in doc
  await setDoc(docRef, {
    count: newCount
  }, { merge: true });
  console.log("Document updated with ID: ", docRef.id);
  return docRef.id;
}

export { saveNewSheetToDb, saveNewUser, fetchUserById, getBingoItems, updateSheetInDb, updateBingoItemCount };