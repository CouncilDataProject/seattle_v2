import { WHERE_OPERATORS, WhereCondition } from "../database";

const EXPECTED_DEFAULT_WHERE = {
    columnName: "a",
    operator: "==",
    value: 1
};

const EXPECTED_GT_WHERE = {
    columnName: "a",
    operator: WHERE_OPERATORS.gt,
    value: 1
};

describe("Construct WhereCondition", () => {
    // Test arrays
    it("with array that contains only column name and value", () => {
        // Create actual
        let actual = new WhereCondition([EXPECTED_DEFAULT_WHERE.columnName, EXPECTED_DEFAULT_WHERE.value]);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_DEFAULT_WHERE.columnName);
        expect(actual.operator).toEqual(EXPECTED_DEFAULT_WHERE.operator);
        expect(actual.value).toEqual(EXPECTED_DEFAULT_WHERE.value);
    });
    it("with array that contains only column name, operator, and value, in order", () => {
        // Create actual
        let actual = new WhereCondition([
            EXPECTED_GT_WHERE.columnName,
            EXPECTED_GT_WHERE.operator,
            EXPECTED_GT_WHERE.value
        ]);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_GT_WHERE.columnName);
        expect(actual.operator).toEqual(EXPECTED_GT_WHERE.operator);
        expect(actual.value).toEqual(EXPECTED_GT_WHERE.value);
    });
    it("with array that contains only column name, operator, and value, out of order or wrong operator", () => {
        expect(() => {
            new WhereCondition([EXPECTED_GT_WHERE.columnName, "blah", EXPECTED_GT_WHERE.value])
        }).toThrow();
    });
    it("with array that contains too few values", () => {
        expect(() => {
            new WhereCondition(["a"])
        }).toThrow();
    });
    it("with array that contains too many values", () => {
        expect(() => {
            new WhereCondition(["a", "b", "c", "d", "e"])
        }).toThrow();
    });
    // Test objects
    it("with object that has attributes for column name and value", () => {
        // Create actual
        let actual = new WhereCondition({
            columnName: EXPECTED_DEFAULT_WHERE.columnName,
            value: EXPECTED_DEFAULT_WHERE.value
        });

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_DEFAULT_WHERE.columnName);
        expect(actual.operator).toEqual(EXPECTED_DEFAULT_WHERE.operator);
        expect(actual.value).toEqual(EXPECTED_DEFAULT_WHERE.value);
    });
    it("with object that has attributes for column name, operator, and value", () => {
        // Create actual
        let actual = new WhereCondition(EXPECTED_GT_WHERE);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_GT_WHERE.columnName);
        expect(actual.operator).toEqual(EXPECTED_GT_WHERE.operator);
        expect(actual.value).toEqual(EXPECTED_GT_WHERE.value);
    });
    it("with object that has attributes for column name, operator, and value, but wrong operator", () => {
        expect(() => {
            new WhereCondition({
                columnName: EXPECTED_GT_WHERE.columnName,
                operator: "blah",
                value: EXPECTED_GT_WHERE.value
            })
        }).toThrow();
    });
    it("with object with missing attributes", () => {
        expect(() => {
            new WhereCondition({})
        }).toThrow();
    });
    it("with string", () => {
        expect(() => {
            new WhereCondition("hello")
        }).toThrow();
    });
    it("with integer", () => {
        expect(() => {
            new WhereCondition(1)
        }).toThrow();
    });
});
