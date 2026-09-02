require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const METAAPI_BASE =
  "https://mt-client-api-v1.new-york.agiliumtrade.ai";

const TOKEN = process.env.METAAPI_TOKEN;
const ACCOUNT_ID = process.env.METAAPI_ACCOUNT_ID;

function headers() {
  return {
    "Content-Type": "application/json",
    "auth-token": TOKEN
  };
}

// اختبار الخادم
app.get("/", (req, res) => {
  res.json({
    status: "online",
    robot: "Gold Robot",
    stage: 2
  });
});

// فحص الاتصال
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Gold Robot API is running"
  });
});

// معلومات حساب MT5
app.get("/account", async (req, res) => {

  if (!TOKEN || !ACCOUNT_ID) {
    return res.status(500).json({
      error: "MetaApi configuration missing"
    });
  }

  try {

    const response = await fetch(
      `${METAAPI_BASE}/users/current/accounts/${ACCOUNT_ID}/account-information`,
      {
        headers: headers()
      }
    );

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {

    res.status(502).json({
      error: "MetaApi connection failed",
      message: error.message
    });

  }
});

// الصفقات المفتوحة
app.get("/positions", async (req, res) => {

  if (!TOKEN || !ACCOUNT_ID) {
    return res.status(500).json({
      error: "MetaApi configuration missing"
    });
  }

  try {

    const response = await fetch(
      `${METAAPI_BASE}/users/current/accounts/${ACCOUNT_ID}/positions`,
      {
        headers: headers()
      }
    );

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {

    res.status(502).json({
      error: "MetaApi connection failed",
      message: error.message
    });

  }
});

// التداول الحقيقي ممنوع في المرحلة الثانية
app.post("/trade", async (req, res) => {

  res.status(403).json({
    error: "LIVE_TRADING_DISABLED",
    message:
      "Trading is disabled during Stage 2. Demo testing is required first."
  });

});

app.listen(PORT, () => {

  console.log(
    `Gold Robot API running on port ${PORT}`
  );

});
