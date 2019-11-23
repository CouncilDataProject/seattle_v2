import firebase from "firebase/app";
import "firebase/firestore";
import { isString } from "./utils";

export const WHERE_OPERATORS = {
    eq: "==",
    contains: "array-contains",
    contains_any: "array-contains-any",
    in: "in",
    gt: ">",
    lt: "<",
    gteq: ">=",
    lteq: "<=",
};

export const ORDER_OPERATORS = {
    asc: "asc",
    desc: "desc"
};

export class WhereCondition {
    /**
    * @param {(Object|Array)} filter The object or array to use to create a WhereCondition from.
    *   When provided an Array, the array should be ordered like so [`columnName`, optional: `operator`, `value`].
    *   When provided an Object, the object must have `columnName` and `value` attributes, and, optional `operator`
    *   attributes. The `operator` is optional in both cases and if left out, will default to value equality.
    */
    constructor(filter) {
        const generalErr = new Error(`Unsure how to create WhereCondition from received data: ${filter}`);

        // Handle array and object
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
                    throw new Error(`
                        Unknown WhereCondition operator: ${filter[1]}
                        Allowed WhereCondition operators: ${Object.values(WHERE_OPERATORS)}
                    `);
                };
            // Log error in any other case
            } else {
                throw generalErr;
            };
        } else if (filter instanceof Object) {
            // All attributes present and operator is valid
            if (
                filter.columnName &&
                filter.operator &&
                filter.value
            ) {
                if (Object.values(WHERE_OPERATORS).includes(filter.operator)) {
                    this.columnName = filter.columnName;
                    this.operator = filter.operator;
                    this.value = filter.value;
                } else {
                    throw new Error(`
                        Unknown WhereCondition operator: ${filter.operator}
                        Allowed WhereCondition operators: ${Object.values(WHERE_OPERATORS)}
                    `);
                };
            // Only column name and value attributes present, assume equal operator
            } else if (filter.columnName && filter.value) {
                this.columnName = filter.columnName;
                this.operator = WHERE_OPERATORS.eq;
                this.value = filter.value;
            } else {
                throw generalErr;
            };
        } else {
            throw generalErr;
        };
    };
};

export class OrderCondition {
    /**
    * @param {(Object|Array|string)} order The object, array, or string to use to create an OrderCondition from.
    *   When provided an Array, the array should be ordered like so [`columnName`, optional: `operator`].
    *   When provided an Object, the object must have `columnName`, and, optional `operator` attributes.
    *   The `operator` is optional in both cases and if left out, will default to `descending`.
    *   When provided a String, the string is simply the `columnName` for the OrderCondition, as the `operator` will
    *   default to `descending`.
    */
    constructor(by) {
        const generalErr = new Error(`Unsure how to create OrderCondition from received data: ${by}`);

        // Handle string, array, and object
        if (isString(by)) {
            this.columnName = by;
            this.operator = ORDER_OPERATORS.desc;
        } else if (by instanceof Array) {
            // Array single item long, assume descending operator
            if (by.length === 1) {
                this.columnName = by[0];
                this.operator = ORDER_OPERATORS.desc;
            // Array of two items long, check order
            } else if (by.length === 2) {
                // Check proper order by ensuring an approved operator is included at index one
                if (Object.values(ORDER_OPERATORS).includes(by[1])) {
                    // Unpack contents
                    this.columnName = by[0];
                    this.operator = by[1];
                } else {
                    throw new Error(`
                        Unknown OrderCondition operator: ${by[1]}
                        Allowed OrderCondition operators: ${Object.values(ORDER_OPERATORS)}
                    `);
                };
            // Log error in any other case
            } else {
                throw generalErr;
            };
        } else if (by instanceof Object) {
            // All attributes present and operator is valid
            if (
                by.columnName &&
                by.operator
            ) {
                if (Object.values(ORDER_OPERATORS).includes(by.operator)) {
                    this.columnName = by.columnName;
                    this.operator = by.operator;
                } else {
                    throw new Error(`
                        Unknown OrderCondition operator: ${by.operator}
                        Allowed OrderCondition operators: ${Object.values(ORDER_OPERATORS)}
                    `);
                };
            // Only column name, assume descending operator
            } else if (by.columnName) {
                this.columnName = by.columnName;
                this.operator = ORDER_OPERATORS.desc;
            } else {
                throw generalErr;
            };
        } else {
            throw generalErr;
        };
    };
};

class Database {
    /**
    * @param {Object} credentials An object that contains all reqired information to interact with a CDP database.
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
    * @param {string} table The name of the table (collection) you want to request results from.
    * @param {string} id The id for the row you want to retrieve.
    * @return {Object} If the row was found, the row's contents are returned as an object.
    */
    async selectRowById(table, id) {
        try {
            const res = await this.connection
                .collection(table)
                .doc(id)
                .get()
                
            return res.data();
        } catch (e) {
            return Promise.reject(e);
        };
    };

    /**
    * @param {Object[]} queryResults The results returned from a query to the database.
    * @return {Object[]} The formatted query results.
    */
    async _unpackQueryResults(queryResults) {
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

    /**
    * @param {string} table The name of the table (collection) you want to request results from.
    * @param {(Object[]|Array[])} [filters] A list of filters (where conditions) to add.
    * @param {(Object|string)} [orderBy] An order by condition to order the results by prior to returning.
    * @param {integer} [limit=1000] An integer limit to how many rows should be returned that match the query provided.
    * @return {Object[]} The formatted query results.
    */
    async selectRowsAsArray(table, filters = [], orderBy = undefined, limit = 1000) {
        try {
            // Make basic reference
            let ref = this.connection.collection(table);

            // Attach filters
            filters.forEach(filter => {
                ref = ref.where(filter.columnName, filter.operator, filter.value);
            });

            // Attach order by
            if (orderBy) {
                ref = ref.orderBy(orderBy.columnName, orderBy.operator);
            };

            // Attach limit
            ref = ref.limit(limit);

            // Make requst
            const res = await ref.get()
                .catch(err => {
                    throw new Error(`Failed to retrieve data from database. Error: ${err}`);
                });

            // Return the formatted results
            return await this._unpackQueryResults(res);
        } catch (e) {
            return Promise.reject(e);
        };
    };
};

// Export created and connected database
export const db = new Database({
    apiKey: "AIzaSyA7aO6weBcOUBZLmxE3aMyn4NeElVEHZUc",
    authDomain: "cdp-sea.firebaseapp.com",
    projectId: "cdp-seattle",
    databaseURL: "https://cdp-sea.firebaseio.com"
});
