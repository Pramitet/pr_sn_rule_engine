const { default: Decimal } = require("decimal.js");

module.exports.OPERAND_TYPE = {
    RELATIONAL: "RELATIONAL",
    ARITHEMATIC: "ARITHEMATIC",
    RAW_VALUE: "RAW_VALUE",
    BIO_MARKER: "BIO_MARKER"
};

module.exports.ARITHEMATIC_OPERATORS = {
    ADD: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    EXPONENT: "^",
    MODULOUS: "%"
};

module.exports.RELATIONAL_OPERATORS = {
    GT: ">",
    GTE: ">=",
    LT: "<",
    LTE: "<=",
    EQ: "=",
    NEQ: "!="
}

module.exports.ZERO = new Decimal(0);