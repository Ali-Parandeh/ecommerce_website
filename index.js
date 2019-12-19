// npm run dev
// Run the above command in the terminal to start the server.
const express = require("express");

const app = express()


// req: incoming information to server from the browser. Use req when receiving information from the user
// res: outgoing response from the server to the browser. Use res to send info back to the user or interact with the browser.
// Listen for GET requests on the root route (/)
app.get("/", (req, res) => 
{
    // You can send a piece of text that is html using `` which will be rendered by the browser.
    // Note: The default method for form submission is GET so you need to overwrite this with a POST request.
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign up</button>
            </form>
        </div>
    `);
});

// Middleware to be used with the post route logic so that the code is refactored.
// Get access to email, passsword and passwordConfirmation
const bodyParser = (req, res, next) => 
{

    if (req.method == 'POST')
    {
        //  Under the hood this is how one needs to parse the data sent by the browser
        req.on('data', data => 
        {
            const parsed =  data.toString('utf8').split('&');
            const formData = {};

            for (let pair of parsed) 
            {
                const [key, value] = pair.split('=');
                formData[key] = value;
            }

            // Assigning data to the body property of req
            req.body = formData;

            // Whenever middleware logic is finished running, you need to call next() function 
            // to let express know it can continue with rest of the routing logic
            next()
        });
    } 
    
    else 
    {
        // Skip this middlware if the request is not a POST method
        next();
    }
};

// Post route of the root route, Great for handling data submitted by the user via the above form
// Browser sends the path and method to server first, server runs the appropriate callback, then chunk by chunk
// the browser sends the rest of the information to the server while receiving confirmation of each chunk
// bodyParser is the middleware being called before the callback function being invoked by the router below.
app.post('/', bodyParser,(req, res) => 
{
    console.log(req.body)
    res.send("Account Created!")
});

// Need to start a server and listen on a port (3000 here) to access the routes above
app.listen(3000, () => 
{
    console.log("listening");
});