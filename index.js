// npm run dev
// Run the above command in the terminal to start the server.
const express = require("express");
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users');

const app = express()

// bodyParser is the middleware being called before the callback function being invoked by the routers.
// Instead of specifying the bodyParser middleware for each route, we use app.use to apply it to all routes
app.use(bodyParser.urlencoded({extended: true}))


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
// Need to pass the option {extended: true} to urlencoded method of bodyParser for parsing HTML form data
// Get access to email, passsword and passwordConfirmation
// First we defined our own middleware but since it has holes in its implementation we will use bodyParser node module.
// const bodyParser = (req, res, next) => 
// {

//     if (req.method == 'POST')
//     {
//         //  Under the hood this is how one needs to parse the data sent by the browser
//         req.on('data', data => 
//         {
//             const parsed =  data.toString('utf8').split('&');
//             const formData = {};

//             for (let pair of parsed) 
//             {
//                 const [key, value] = pair.split('=');
//                 formData[key] = value;
//             }

//             // Assigning data to the body property of req
//             req.body = formData;

//             // Whenever middleware logic is finished running, you need to call next() function 
//             // to let express know it can continue with rest of the routing logic
//             next()
//         });
//     } 
    
//     else 
//     {
//         // Skip this middlware if the request is not a POST method
//         next();
//     }
// };

// Post route of the root rout method to server first, server runs the appropriate callback, then chunk by chunk
// the browser sends the rest of the information to the server while receiving confirmation of each chunk
app.post('/', async (req, res) => 
{
    const {email, password, passwordConfirmation} = req.body;

    // Checking whether a user already exists in the database.
    // Note: Can use usersRepo.getOneBy({email}) instead of usersRepo.getOneBy({email: email}) as key & value are identical
    // Note: Anywhere 'await' keyword is used in a function, the enclosing functions needs to be labled 'async'.
    const existingUser = await usersRepo.getOneBy({email});

    if (existingUser)
    {
        return res.send('Email is in use');
    }

    if (password !== passwordConfirmation)
    {
        return res.send('Passwords must match');
    }

    // Create a user in the user repo to represent our user
    // Note: keys and values are identical so can shortern the code as below.
    const user = await usersRepo.create({email, password});

    // Store the id of the user inside the user cookie.

    res.send('Account Created');
});

// Need to start a server and listen on a port (3000 here) to access the routes above
app.listen(3001, () => 
{
    console.log("listening");
});