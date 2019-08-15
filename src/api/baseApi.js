import * as firebase from "firebase";
import "firebase/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyA7aO6weBcOUBZLmxE3aMyn4NeElVEHZUc",
    authDomain: "cdp-sea.firebaseapp.com",
    projectId: 'cdp-seattle',
    databaseURL: "https://cdp-sea.firebaseio.com",
  });

  const db = firebase.firestore();

  /**
   * 
   * @param {string} tableName table to get all resources from
   * @return {function} returns function that fetches all resources
   */
  export function getAllResources(tableName) {
      return async function(){
        return db.collection(tableName).get()
        .catch(err => {
            console.err('err--->', err)
        })
      } 
  }

export function getSingleResource(tableName, id){
    return async function(){
        return db.collection(tableName).where('id', '==', id).get()
    }

}


