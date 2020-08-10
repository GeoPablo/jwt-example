/**
 * * Dependencies
 */
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const app = require("express")();
const jwt = require("jsonwebtoken");

/**
 * *vars
 */

const dbMock = [{ email: "test@gmail.com", pwd: "12345678" }];
const secretKey = "shhhh";

/**
 * * auth
 */
const jwtGuard = () => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send();
      return;
    }
    try {
      const decodedToken = jwt.verify(authorization, secretKey);
      const { email } = decodedToken;
      const user = dbMock.find((user) => user.email === email);

      if (!user) {
        res.status(401).send();
        return;
      }
    } catch (err) {
      res.status(401).send();
      return;
    }

    next();
  };
};

/**
 * * Express config and routes
 */

app.use(bodyParser());

app.get("/", function (req, res) {
  res.send("JWT Example");
});

app.post("/login", (req, res) => {
  const { email, pwd } = req.body;

  const user = dbMock.find(
    (user) => (user.email === email) & (user.pwd === pwd)
  );

  if (!user) {
    res.status(401).send();
    return;
  }

  const token = jwt.sign({ email: user.email }, secretKey, {
    expiresIn: "1h",
  });

  res.json({ token });
});

app.get("/protected", jwtGuard(), (req, res) => {
  res.send("You are in");
});

app.listen(PORT, () => {
  console.log(`App is up at port ${PORT}`);
});
