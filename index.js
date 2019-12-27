// npm run dev
// NOTE: Run the above command in the terminal to start the server.
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");

const app = express();

// NOTE: The order of middlwares passed to the app.use below matters.
// Create a new middleware function to serve files from within a given root directory.
// The file to serve will be determined by combining req.url with the provided root directory.
app.use(express.static("public"));

// bodyParser is the middleware being called before the callback function being invoked by the routers.
// Instead of specifying the bodyParser middleware for each route, we use app.use to apply it to all routes.
// NOTE: Only works with default forms.
app.use(bodyParser.urlencoded({ extended: true }));

// CookieSession is a middleware like BodyParser. To use it in all routes, we can use app.use
// Note: Keys options passed in to CookieSession is used to encrypt content of the cookies stored on user's browser.
// Note: CookieSession library adds an additional property to the req object passed in to routes below - req.session.
app.use(cookieSession({ keys: ["kjdhasjdhajskhd"] }));

// Need to use the routers
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

// Need to start a server and listen on a port (3000 here) to access the routes above
app.listen(3001, () => {
  console.log("listening");
});
