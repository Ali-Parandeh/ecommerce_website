// npm run dev
// Run the above command in the terminal to start the server.
const express = require("express");

const app = express()


// req: incoming information to server from the browser. Use req when receiving information from the user
// res: outgoing response from the server to the browser. Use res to send info back to the user or interact with the browser.
// Listen for GET requests on the root route (/)
app.get("/", (req, res) => {
    res.send("hi there");
});

// Need to start a server and listen on a port (3000 here) to access the routes above
app.listen(3000, () => {
    console.log("listening");
});