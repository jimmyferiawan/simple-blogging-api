const express = require("express");
const app = express();
const authRouter = require("./routes/AuthRouter");
const otpRouter = require("./routes/OtpRouter");
const cors = require("cors");
const { PassThrough } = require("stream");
const { requestLogger, responseLogger } = require("./helpers/logger");

const corsOption = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
};

const PORT = process.env.APP_PORT || 9003;

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  requestLogger(req);
  const defaultWrite = res.write.bind(res);
  const defaultEnd = res.end.bind(res);
  const ps = new PassThrough();
  const chunks = [];
  ps.on("data", (data) => chunks.push(data));
  res.write = (...args) => {
    ps.write(...args);
    defaultWrite(...args);
  };
  res.end = (...args) => {
    ps.end(...args);
    defaultEnd(...args);
  };
  res.on("finish", () => {
    // console.log("req.body", req.body);
    let headersResp = "";
    let bodyResp = "";
    try {
      // console.log("Buffer.concat(chunks).toString() => ", Buffer.concat(chunks).toString());
      headersResp = JSON.parse(JSON.stringify(res.getHeaders()));
      bodyResp = JSON.parse(Buffer.concat(chunks).toString());
    } catch (err) {
      // console.log(err);
      bodyResp = Buffer.concat(chunks).toString();
    }

    const logData = {
      status: res.statusCode,
      headers: headersResp,
      body: bodyResp,
    };
    responseLogger(logData);
  });
  next();
});

app.use("/", authRouter);
app.use("/", otpRouter);

app.use("*", function (req, res) {
  res.status(404).send({
    err: true,
    message: req.method + " " + req.originalUrl + " Not found!",
  });
});

app.use((err, req, res, next) => {
  requestLogger(req);
  const defaultWrite = res.write.bind(res);
  const defaultEnd = res.end.bind(res);
  const ps = new PassThrough();
  const chunks = [];
  ps.on("data", (data) => chunks.push(data));
  res.write = (...args) => {
    ps.write(...args);
    defaultWrite(...args);
  };
  res.end = (...args) => {
    ps.end(...args);
    defaultEnd(...args);
  };
  res.on("finish", () => {
    // console.log("req.body", req.body);
    let headersResp = "";
    let bodyResp = "";
    try {
      headersResp = JSON.parse(JSON.stringify(res.getHeaders()));
      bodyResp = JSON.parse(Buffer.concat(chunks).toString());
    } catch (err) {
      //   console.log(err);
      bodyResp = Buffer.concat(chunks).toString();
    }

    const logData = {
      status: res.statusCode,
      headers: headersResp,
      body: bodyResp,
    };
    responseLogger(logData);
  });
  res.status(err.status || 500).json({ message: err.message })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`app listening at http://0.0.0.0:${PORT}`);
});
