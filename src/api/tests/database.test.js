import { WHERE_OPERATORS, ORDER_OPERATORS, WhereCondition, OrderCondition } from "../database";

const EXPECTED_DEFAULT_WHERE = {
    columnName: "a",
    operator: WHERE_OPERATORS.eq,
    value: 1
};

const EXPECTED_GT_WHERE = {
    columnName: "a",
    operator: WHERE_OPERATORS.gt,
    value: 1
};

const EXPECTED_DEFAULT_ORDER = {
    columnName: "a",
    operator: ORDER_OPERATORS.desc,
};

const EXPECTED_ASC_ORDER = {
    columnName: "a",
    operator: ORDER_OPERATORS.asc
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

describe("Construct OrderCondition", () => {
    // Test string
    it("with string", () => {
        // Create actual
        let actual = new OrderCondition(EXPECTED_DEFAULT_ORDER.columnName);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_DEFAULT_ORDER.columnName);
        expect(actual.operator).toEqual(EXPECTED_DEFAULT_ORDER.operator);
    });
    // Test arrays
    it("with array that contains only column name", () => {
        // Create actual
        let actual = new OrderCondition([EXPECTED_DEFAULT_ORDER.columnName]);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_DEFAULT_ORDER.columnName);
        expect(actual.operator).toEqual(EXPECTED_DEFAULT_ORDER.operator);
    });
    it("with array that contains only column name and operator, in order", () => {
        // Create actual
        let actual = new OrderCondition([
            EXPECTED_ASC_ORDER.columnName,
            EXPECTED_ASC_ORDER.operator
        ]);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_ASC_ORDER.columnName);
        expect(actual.operator).toEqual(EXPECTED_ASC_ORDER.operator);
    });
    it("with array that contains only column name and operator, out of order or wrong operator", () => {
        expect(() => {
            new OrderCondition([EXPECTED_ASC_ORDER.columnName, "blah"])
        }).toThrow();
    });
    it("with array that contains too few values", () => {
        expect(() => {
            new OrderCondition([])
        }).toThrow();
    });
    it("with array that contains too many values", () => {
        expect(() => {
            new OrderCondition(["a", "b", "c", "d", "e"])
        }).toThrow();
    });
    // Test objects
    it("with object that has attribute for column name", () => {
        // Create actual
        let actual = new OrderCondition({
            columnName: EXPECTED_DEFAULT_ORDER.columnName
        });

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_DEFAULT_ORDER.columnName);
        expect(actual.operator).toEqual(EXPECTED_DEFAULT_ORDER.operator);
    });
    it("with object that has attributes for column name and operator", () => {
        // Create actual
        let actual = new OrderCondition(EXPECTED_ASC_ORDER);

        // Check values
        expect(actual.columnName).toEqual(EXPECTED_ASC_ORDER.columnName);
        expect(actual.operator).toEqual(EXPECTED_ASC_ORDER.operator);
    });
    it("with object that has attributes for column name and operator, but wrong operator", () => {
        expect(() => {
            new OrderCondition({
                columnName: EXPECTED_ASC_ORDER.columnName,
                operator: "blah"
            })
        }).toThrow();
    });
    it("with object with missing attributes", () => {
        expect(() => {
            new OrderCondition({})
        }).toThrow();
    });
    it("with integer", () => {
        expect(() => {
            new OrderCondition(1)
        }).toThrow();
    });
});
