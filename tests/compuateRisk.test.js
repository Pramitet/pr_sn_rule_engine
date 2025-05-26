// tests/computeRisk.test.js
const request = require("supertest");
const app = require("../app"); // Your Express app

describe("POST /compute-risk Success Cases", () => {
  it("Setting up User BioMarkters", async () => {
    const biomarkerResponse = await request(app)
      .post("/add-biomarker")
      .send({
        userId: "TestUser",
        biomarkers: {
          blood_glucose: {
            value: "150",
            timestamp: "2024-05-01T12:00:00Z",
            report: "report_001",
          },
          HbA1c: {
            value: "6.6",
            timestamp: "2024-05-01T12:00:00Z",
            report: "report_002",
          },
          exercise_minutes: {
            value: "30",
            timestamp: "2024-05-01T12:00:00Z",
            report: "report_003",
          },
          sleep_hours: {
            value: "7",
            timestamp: "2024-05-01T12:00:00Z",
            report: "report_004",
          },
          parent_with_diabetes: {
            value: "1",
            timestamp: "2024-05-01T12:00:00Z",
            report: "report_005",
          },
        },
      });
    expect(biomarkerResponse.statusCode).toBe(200);
    expect(biomarkerResponse.body.success).toBe(true);
  });

  it("Setting up conditions", async () => {
    const res = await request(app).post("/add-condition").send({
      id: "cond_001",
      name: "cardiovascular_disease_risk",
      version: "3",
      latest: true,
      rules: [
        {
          type: "RELATIONAL",
          left: {
            type: "BIO_MARKER",
            value: "blood_glucose",
          },
          right: {
            type: "RAW_VALUE",
            value: "140",
          },
          operator: ">",
          value: "20",
        },
        {
          type: "RELATIONAL",
          left: {
            type: "BIO_MARKER",
            value: "HbA1c",
          },
          right: {
            type: "RAW_VALUE",
            value: "6.5",
          },
          operator: ">",
          value: "25",
        },
        {
          type: "RELATIONAL",
          left: {
            type: "BIO_MARKER",
            value: "exercise_minutes",
          },
          right: {
            type: "RAW_VALUE",
            value: "30",
          },
          operator: ">=",
          value: "-10",
        },
        {
          type: "RELATIONAL",
          left: {
            type: "ARITHEMATIC",
            left: {
              type: "BIO_MARKER",
              value: "sleep_hours",
            },
            right: {
              type: "BIO_MARKER",
              value: "parent_with_diabetes",
            },
            operator: "+",
          },
          right: {
            type: "RAW_VALUE",
            value: "8",
          },
          operator: ">=",
          value: "-20",
        },
      ],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 200 and riskFactor", async () => {
    const start = Date.now();
    const res = await request(app).post("/compute-risk").send({
      userId: "TestUser",
      conditionId: "cond_001",
    });
    const duration = Date.now() - start;

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("riskFactor");
    expect(res.body.riskFactor).toBe('15');
    // Response time should be less than 1s
    expect(duration).toBeLessThan(1000);

  });
});
