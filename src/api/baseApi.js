import * as firebase from "firebase";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyA7aO6weBcOUBZLmxE3aMyn4NeElVEHZUc",
  authDomain: "cdp-sea.firebaseapp.com",
  projectId: "cdp-seattle",
  databaseURL: "https://cdp-sea.firebaseio.com"
});

const db = firebase.firestore();

async function extractData(queryResults) {
  const results = [];
  queryResults.forEach(doc => {
    const data = doc.data();
    const thisEvent = {
      id: doc.id,
      ...data
    };
    results.push(thisEvent);
  });
  return results;
}

/**
 *
 * @param {string} tableName table to get all resources from
 * @return {array} returns array of resources
 */
export async function getAllResources(tableName) {
  const res = await db
    .collection(tableName)
    .get()
    .catch(err => {
      console.err("err--->", err);
    });
  return extractData(res);
}

export async function getSingleResource(tableName, accessor, id) {
  try {
    const res = await db
      .collection(tableName)
      .where(accessor, "==", id)
      .get()
      .catch(err => {
        console.err("err--->", err);
      });

    return extractData(res);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getResourceById(tableName, id) {
  try {
    const res = await db
      .collection(tableName)
      .doc(id)
      .get();

    return res.data();
  } catch (e) {
    return Promise.reject(e);
  }
}
