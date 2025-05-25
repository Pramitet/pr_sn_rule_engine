const { default: Decimal } = require("decimal.js");

module.exports.OPERAND_TYPE = {
    RELATIONAL,
    ARITHEMATIC,
    RAW_VALUE,
    BIO_MARKER
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