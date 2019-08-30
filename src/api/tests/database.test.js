import * as assert from "assert";
import { WHERE_OPERATORS, WhereCondition } from "../database";

const EXPECTED_DEFAULT_WHERE = new WhereCondition(["a", 1]);

const EXPECTED_GT_WHERE = new WhereCondition(["a", WHERE_OPERATORS.gt, 1]);

describe("Construct WhereCondition", () => {
    // Test arrays
    it("with array that contains only column name and value", () => {
        assert.deepEqual(new WhereCondition(["a", 1]), EXPECTED_DEFAULT_WHERE);
    });
    it("with array that contains only column name, operator, and value, in order", () => {
        assert.deepEqual(new WhereCondition(["a", WHERE_OPERATORS.gt, 1]), EXPECTED_GT_WHERE);
    });
    it("with array that contains only column name, operator, and value, out of order or wrong operator", () => {
        assert.throws(new WhereCondition(["a", "blah", 1]));
    });
    it("with array that contains too few values", () => {
        assert.throws(new WhereCondition(["a"]));
    });
    it("with array that contains too many values", () => {
        assert.throws(new WhereCondition(["a", "b", "c", "d", "e"]));
    });
    // Test objects
    it("with object that has attributes for column name and value", () => {
        assert.deepEqual(new WhereCondition({columnName: "a", value: 1}), EXPECTED_DEFAULT_WHERE);
    });
    it("with object that has attributes for column name, operator, and value", () => {
        assert.deepEqual(
            new WhereCondition({
                columnName: "a",
                operator: WHERE_OPERATORS.gt,
                value: 1}),
            EXPECTED_GT_WHERE);
    });
    it("with object that has attributes for column name, operator, and value, but wrong operator", () => {
        assert.throws(
            new WhereCondition({
                columnName: "a",
                operator: "blah",
                value: 1}));
    });
    it("with object with missing attributes", () => {
        assert.throws(new WhereCondition({}));
    });
    it("with string", () => {
        assert.throws(new WhereCondition("hello"));
    });
    it("with integer", () => {
        assert.throws(new WhereCondition(1));
    });
});
