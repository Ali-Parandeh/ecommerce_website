// npm run dev
// Run the above command in the terminal to start the server.
const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const usersRepo = require('./repositories/users');

const app = express()

// bodyParser is the middleware being called before the callback function being invoked by the routers.
// Instead of specifying the bodyParser middleware for each route, we use app.use to apply it to all routes.
app.use(bodyParser.urlencoded({extended: true}))

// CookieSession is a middleware like BodyParser. To use it in all routes, we can use app.use
// Note: Keys options passed in to CookieSession is used to encrypt content of the cookies stored on user's browser.
// Note: CookieSession library adds an additional property to the req object passed in to routes below - req.session.
app.use(cookieSession({keys: ['kjdhasjdhajskhd']}));


// req: incoming information to server from the browser. Use req when receiving information from the user
// res: outgoing response from the server to the browser. Use res to send info back to the user or interact with the browser.
// Listen for GET requests on the root route (/)
app.get("/signup", (req, res) => 
{
    // You can send a piece of text that is html using `` which will be rendered by the browser.
    // Note: The default method for form submission is GET so you need to overwrite this with a POST request.
    res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign up</button>
                </form>
                </div>
                `);
            });
            

// Post route of the root rout method to server first, server runs the appropriate callback, then chunk by chunk
// the browser sends the rest of the information to the server while receiving confirmation of each chunk
app.post('/signup', async (req, res) => 
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
    req.session.userId = user.id;

    res.send('Account Created');
});

// Sign out route
app.get('/signout', (req, res) => 
{
    req.session = null
    res.send('You are logged out!');
});

// Sign in route (GET)
app.get('/signin', (req, res) => 
{
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <button>Sign in</button>
        </form>
    </div> 
    `);
});

// Sign in route (POST)
app.post('/signin', async (req, res) => 
{
    const {email, password} = req.body;
    const user = await usersRepo.getOneBy({email});

    if(!user)
    {
        return res.send('Email not found');
    }

    if(user.password !== password)
    {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send('You are signed in!');

});


// Need to start a server and listen on a port (3000 here) to access the routes above
app.listen(3001, () => 
{
    console.log("listening");
});