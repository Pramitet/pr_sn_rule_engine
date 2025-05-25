const { default: Decimal } = require("decimal.js");
const {
  OPERAND_TYPE,
  ARITHEMATIC_OPERATORS,
  RELATIONAL_OPERATORS,
  ZERO,
} = require("../constants/constants");

async function evaluateRules(rules, userMarker, currentValue) {
  if (!currentValue) {
    currentValue = 0;
  }
  if (!rules) {
    return currentValue;
  }

  const result = await Promise.all(
    rules.map(async (rule) => {
      return evaluateRule(rule, userMarker, ZERO);
    })
  );

  const total = result.reduce((acc, val) => acc.plus(val), ZERO);
  return total;
}

function evaluateRule(rule, userMarker, default_value = ZERO) {
  if (!rule) {
    return default_value;
  }
  switch (rule.type) {
    case OPERAND_TYPE.BIO_MARKER: {
      if (userMarker[rule.value]) {
        return userMarker[rule.value];
      }
      console.warn(
        `userMarker ${rule.value} not found for ${userMarker.userId} using default Value ${default_value}`
      );
      return default_value;
    }
    case OPERAND_TYPE.RAW_VALUE: {
      return rule.value || default_value;
    }
    case OPERAND_TYPE.ARITHEMATIC: {
      let left = default_value,
        right = default_value;
      if (rule.left) {
        left = evaluateRule(rule.left, userMarker, default_value);
      }
      if (rule.right) {
        right = evaluateRule(rule.right, userMarker, default_value);
      }
      return evaluateArithematicOperation(
        left,
        right,
        rule.operator,
        default_value
      );
    }
    case OPERAND_TYPE.RELATIONAL: {
      let left = default_value,
        right = default_value;
      if (rule.left) {
        left = evaluateRule(rule.left, userMarker, default_value);
      }
      if (rule.right) {
        right = evaluateRule(rule.right, userMarker, default_value);
      }
      if (evaluateRelationalOperation(left, right, rule.operator, false)) {
        return new Decimal(rule.value);
      }
      return ZERO;
    }
  }
}

function evaluateArithematicOperation(left, right, operator, default_value) {
  if (typeof left === "string") {
    left = new Decimal(left);
  }

  if (typeof right === "string") {
    right = new Decimal(right);
  }

  switch (operator) {
    case ARITHEMATIC_OPERATORS.ADD: {
      return left.add(right);
    }
    case ARITHEMATIC_OPERATORS.MINUS: {
      return left.minus(right);
    }
    case ARITHEMATIC_OPERATORS.DIVIDE: {
      return left.dividedBy(right);
    }
    case ARITHEMATIC_OPERATORS.MULTIPLY: {
      return left.times(right);
    }
    case ARITHEMATIC_OPERATORS.MODULOUS: {
      return left.modulo(right);
    }
    case ARITHEMATIC_OPERATORS.EXPONENT: {
      return left.naturalExponential(right);
    }
  }
  return default_value;
}

function evaluateRelationalOperation(left, right, operator, default_value) {
  if (typeof left === "string") {
    left = new Decimal(left);
  }

  if (typeof right === "string") {
    right = new Decimal(right);
  }

  switch (operator) {
    case RELATIONAL_OPERATORS.EQ: {
      return left.equals(right);
    }
    case RELATIONAL_OPERATORS.NEQ: {
      return !left.equals(right);
    }
    case RELATIONAL_OPERATORS.GT: {
      return left.greaterThan(right);
    }
    case RELATIONAL_OPERATORS.GTE: {
      return left.greaterThanOrEqualTo(right);
    }
    case RELATIONAL_OPERATORS.LT: {
      return left.lessThan(right);
    }
    case RELATIONAL_OPERATORS.LTE: {
      return left.lessThanOrEqualTo(right);
    }
  }
  return default_value;
}

module.exports = {
  evaluateRules,
};
