//@ts-nocheck

import { set } from "firebase/database";
import { db } from "./firebase.ts";
import { collection, addDoc, getDocs, getDoc, setDoc, doc, arrayUnion, deleteDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import "firebase/auth";
import { GeoPoint } from "firebase/firestore";
import { auth } from './firebase.ts'

const getBingoItems = async () => {
  const itemsArray = [];
  const querySnapshot = await getDocs(collection(db, "bingoItems"));
  querySnapshot.forEach((doc) => {
    const addId = { ...doc.data(), id: doc.id };
    itemsArray.push(addId);
  });
  return itemsArray;
}

const getBingoItemById = async (id) => {
  const docRef = doc(db, "bingoItems", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const item = docSnap.data();
    return item;
  } else {
    console.log("No such document!");
  }
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

const fetchSheetById = async (id) => {
  const docRef = doc(db, "bingoSheets", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const sheet = docSnap.data().sheet;
    return sheet;
  } else {
    console.log("No such document!");
  }
}

//save user in team collection under members array
const addUserToTeam = async (userId, teamId) => {
  const teamRef = doc(db, "teams", teamId);

  // ensure the document exists (create if missing)
  const teamSnap = await getDoc(teamRef);
  if (!teamSnap.exists()) {
    await setDoc(teamRef, { members: [] }); // create the doc if not found
  }
  // now safely update it
  await setDoc(teamRef, {
    members: arrayUnion({ id: userId })
  }, { merge: true });

  console.log(`User ${userId} added to team ${teamId}`);
};

const saveNewUser = async (id, name, team) => {
  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    console.log("User already exists:", userSnap.data());
    return;
  }
  await setDoc(userRef, {
    name,
    score: 0,
    team,
  });
  await addUserToTeam(id, team);
  console.log("User saved with ID:", userRef.id);
  return id;
};

const getAllUsers = async () => {
  const userArray = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
      const addData = { ...doc.data(), id: doc.id };
      userArray.push(addData);
});
    return userArray;
}

const updateUserScore = async (id) => {
  const docRef = doc(db, "users", id);
  let score = await getDoc(docRef);
  score = score.data().score;
  const newScore = score + 1;
  await setDoc(docRef, {
    score: newScore
  }, { merge: true });
  console.log("Document updated with ID: ", docRef.id);
  return docRef.id;
}

const fetchUserById = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

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

const minusBingoItemCount = async (id) => {
  const docRef = doc(db, "bingoItems", id);
  let countBefore = await getDoc(docRef);
  countBefore = countBefore.data().count;
  const newCount = countBefore - 1;
 //update only one field in doc
  await setDoc(docRef, {
    count: newCount
  }, { merge: true });
  console.log("Document updated with ID: ", docRef.id);
  return docRef.id;
}

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider).then((result) => {
    //get firebase user credentials
    auth.onAuthStateChanged(async (user) => {
      //check if already in db
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      }
      else{
        const docRef = await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          score: 0,
          team: Math.random() < 0.5 ? "redTeam" : "whiteTeam"
        });
        
      }
      //set local storage
      localStorage.setItem('userName', user.displayName)
      localStorage.setItem('userId', user.uid)
      localStorage.setItem('team', user.team)
      location.reload()
      })    
  })
}

export const saveLocation = async (id, team, lat, long) => { 
  const docRef = await addDoc(collection(db, "flags"), {
    item: id,
    team: team,
    location: new GeoPoint(lat, long)

  });
  //give team one point
  await updateTeamScore(team);
  return docRef.id;
}

export const fetchOwnFlags = async (team) => {
  const itemsArray = [];
  try {
  const querySnapshot = await getDocs(collection(db, "flags"));
  querySnapshot.forEach((doc) => {
    if (doc.data().team === team) {
      const addId = { ...doc.data(), id: doc.id };
      itemsArray.push(addId);
    }
  })
} catch (error) {
  console.error("Error fetching flags: ", error);
}
  return itemsArray;
}

export const getTeamFlags = async (team) => {
  if(team === 'redTeam') {
    team = 'whiteTeam'
  }
  else if(team === 'whiteTeam') {
    team = 'redTeam'
  }
  const itemsArray = [];
  try {
  const querySnapshot = await getDocs(collection(db, "flags"));
  querySnapshot.forEach((doc) => {
    //only fetch the flags for the OTHER team 
    if (doc.data().team === team) {
      const addId = { ...doc.data(), id: doc.id };
      itemsArray.push(addId);
    }
  });
} catch (error) {
  console.error("Error fetching flags: ", error);
}
  return itemsArray;
}

export const deleteFlag = async (id) => {
  const querySnapshot = await getDocs(collection(db, "flags"));
  let flagId = null;
  querySnapshot.forEach((docSnap) => {
    if (docSnap.data().item === id) {
      flagId = docSnap.id;
    }
  });

  if (flagId) {
    const docRef = doc(db, "flags", flagId);
    await deleteDoc(docRef);
    //console.log(`Flag with id ${flagId} deleted`);
    await updateTeamScore(localStorage.getItem('team'));
    //minus for the other team
    if(localStorage.getItem('team') === 'redTeam') {
      await teamMinusOne('whiteTeam');
    }
    else if(localStorage.getItem('team') === 'whiteTeam') {
      await teamMinusOne('redTeam');
    }
  } else {
    return
    //console.warn(`No flag found with item = ${id}`);
  }
}

const updateTeamScore = async (team) => {
  const docRef = doc(db, "teams", team);
  let teamData = await getDoc(docRef);
  let score = teamData.data().points;
  const newScore = score + 1;
  await setDoc(docRef, {
    points: newScore
  }, { merge: true });
  console.log("Document updated with ID: ", docRef.id);
}

export const teamMinusOne = async (team) => {
  const docRef = doc(db, "teams", team);
  let teamData = await getDoc(docRef);
  let score = teamData.data().points;
  //if score is 0, do not minus
  if (score > 0) {
    const newScore = score - 1;
    await setDoc(docRef, {
      points: newScore
    }, { merge: true });
    console.log("Document updated with ID: ", docRef.id);
  } else {
    return
  }
}

export const fetchTeamById = async (id: string) => {
  const docRef = doc(db, "teams", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.warn("No such document:", id);
    return null;            // <-- explicitly return null
  }
  return docSnap.data();   // the object you expect
}

export const fetchAdressByCoords = async (lat, long) => {
  const api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(api);
  const data = await response.json();
  if (data.status === "OK") {
    //only return the street + nymber
    const address = data.results[0].address_components[1].long_name+ ' ' + data.results[0].address_components[0].long_name;
    return address
  } else {
    console.error("Error fetching address: ", data.status);
    return null;
  }
}

export { saveNewSheetToDb, saveNewUser, fetchUserById, getBingoItems, updateSheetInDb, updateBingoItemCount, updateUserScore, fetchUserByName, getAllUsers, fetchSheetById, minusBingoItemCount, getBingoItemById };