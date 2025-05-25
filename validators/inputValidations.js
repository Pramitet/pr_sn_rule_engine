const Joi = require("joi");
const {
  ARITHEMATIC_OPERATORS,
  RELATIONAL_OPERATORS,
} = require("../constants/constants");

const biomarkerEntrySchema = Joi.object({
  value: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  report: Joi.string().required(),
});

const userBiomarkersSchema = Joi.object({
  userId: Joi.string().required(), // userId is required
  biomarkers: Joi.object()
    .pattern(
      // Accepts dynamic biomarker keys
      Joi.string(),
      biomarkerEntrySchema
    )
    .required(),
});

const computeRiskSchema = Joi.object({
  userId: Joi.string().required(), // userId is required
  conditionId: Joi.string().required(),
  force: Joi.bool().optional(),
});

//Setting max depth as 5 for now in the recursive call
const createOperandSchemaWithDepth = (maxDepth = 5) => {
  const createSchema = (depth) => {
    if (depth <= 0) {
      // Base case: Either should be BIO_MARKER", "RAW_VALUE
      return Joi.object({
        type: Joi.string().valid("BIO_MARKER", "RAW_VALUE").required(),
        value: Joi.string().required(),
      }).strict(true);
    }

    return Joi.object({
      type: Joi.string()
        .valid("BIO_MARKER", "RAW_VALUE", "ARITHEMATIC", "RELATIONAL")
        .required(),

      value: Joi.alternatives().conditional("type", {
        switch: [
          { is: "BIO_MARKER", then: Joi.string().required() },
          { is: "RAW_VALUE", then: Joi.string().required() },
          { is: "RELATIONAL", then: Joi.string().required() },
          { is: "ARITHEMATIC", then: Joi.forbidden() },
        ],
        otherwise: Joi.any().forbidden(),
      }),

      left: Joi.alternatives().conditional("type", {
        switch: [
          { is: "ARITHEMATIC", then: createSchema(depth - 1).required() },
          { is: "RELATIONAL", then: createSchema(depth - 1).required() },
        ],
        otherwise: Joi.any().forbidden(),
      }),

      right: Joi.alternatives().conditional("type", {
        switch: [
          { is: "ARITHEMATIC", then: createSchema(depth - 1).required() },
          { is: "RELATIONAL", then: createSchema(depth - 1).required() },
        ],
        otherwise: Joi.any().forbidden(),
      }),

      operator: Joi.when("type", {
        switch: [
          {
            is: "ARITHEMATIC",
            then: Joi.string()
              .valid(...Object.values(ARITHEMATIC_OPERATORS))
              .required(),
          },
          {
            is: "RELATIONAL",
            then: Joi.string()
              .valid(...Object.values(RELATIONAL_OPERATORS))
              .required(),
          },
        ],
      }),
    }).strict(true);
  };

  return createSchema(maxDepth);
};

const operandSchema = createOperandSchemaWithDepth();

const ruleSchema = Joi.object({
  type: Joi.string().valid("RELATIONAL").required(), // In the rules tree, the first object will always be Relational
  left: operandSchema.required(), // Relational type will always have left, right, operator and value
  right: operandSchema.required(),
  operator: Joi.string()
    .valid(...Object.values(RELATIONAL_OPERATORS))
    .required(),
  value: Joi.string().required(),
});

const conditionSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  version: Joi.string().required(),
  latest: Joi.boolean().required(),
  rules: Joi.array().items(ruleSchema).required(),
});

module.exports = { userBiomarkersSchema, computeRiskSchema, conditionSchema };
