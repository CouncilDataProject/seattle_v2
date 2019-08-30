import firebase from "firebase/app";
import "firebase/firestore";

export const WHERE_OPERATORS = {
    eq: "==",
    contains: "in",
    gt: ">",
    lt: "<",
    gteq: ">=",
    lteq: "<=",
};

export class WhereCondition {
    /**
    * @param {(Object|Array)} filter The object or array to use to create a WhereCondition from.
    *   When provided an Array, the array should be ordered like so [`columnName`, optional: `operator`, `value`].
    *   When provided an Object, the object must have `columnName` and `value` attributes.
    *   The `operator` is optional in both cases and if left out, will default to equals.
    */
    constructor(filter) {
        const errMessage = `Unsure how to create WhereCondition from received data: ${filter}`;

        // Handle array
        if (filter instanceof Array) {
            // Array two items long, assume equal operator
            if (filter.length === 2) {
                this.columnName = filter[0];
                this.operator = WHERE_OPERATORS.eq;
                this.value = filter[1];
            // Array of three items long, check order
            } else if (filter.length === 3) {
                // Check proper order by ensuring an approved operator is included at index one
                if (Object.values(WHERE_OPERATORS).includes(filter[1])) {
                    // Unpack contents
                    this.columnName = filter[0];
                    this.operator = filter[1];
                    this.value = filter[2];
                } else {
                    throw `
                        Unknown WhereCondition operator: ${filter[1]}
                        Allowed WhereCondition operators: ${Object.values(WHERE_OPERATORS)}
                    `;
                };
            // Log error in any other case
            } else {
                throw errMessage;
            };
        } else if (filter instanceof Object) {
            // All attributes present and operator is valid
            if (
                filter.columnName &&
                filter.operator &&
                Object.values(WHERE_OPERATORS).includes(filter[1]) &&
                filter.value
            ) {
                this.columnName = filter.columnName;
                this.operator = filter.operator;
                this.value = filter.value;
            // Only column name and value attributes present, assume equal operator
            } else if (filter.columnName && filter.value) {
                this.columnName = filter.columnName;
                this.operator = WHERE_OPERATORS.eq;
                this.value = filter.value;
            } else {
                throw errMessage;
            };
        } else {
            throw errMessage;
        };
    };
};

class Database {
    /**
    * @param {object} credentials An object that contains all reqired information to interact with a CDP database
    */
    constructor(credentials) {
        // Store for save keeping
        this.credentials = credentials;

        // Initialize Connection
        firebase.initializeApp(this.credentials);

        // Store connection
        this.connection = firebase.firestore();
    };

    /**
    * @param {string} tableName The name of which table you want to request results from
    * @param {string} id The id for the row you want to retrieve
    * @return {object} If the row was found, the row's contents are returned as an object
    */
    async selectRowById(tableName, id) {
        try {
            const res = await this.connection
                .collection(tableName)
                .doc(id)
                .get()

            return res.data();
        } catch (e) {
            return Promise.reject(e);
        };
    };

    /**
    * @param {array} queryResults The results returned from a query to the database
    * @return {array} The formatted query results
    */
    async formatQueryResults(queryResults) {
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
    };
};

// Export created and connected database
export const db = new Database({
    apiKey: "AIzaSyA7aO6weBcOUBZLmxE3aMyn4NeElVEHZUc",
    authDomain: "cdp-sea.firebaseapp.com",
    projectId: "cdp-seattle",
    databaseURL: "https://cdp-sea.firebaseio.com"
});
