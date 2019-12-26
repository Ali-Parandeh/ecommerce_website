// Middleware to be used with the post route logic so that the code is refactored.
// Need to pass the option {extended: true} to urlencoded method of bodyParser for parsing HTML form data
// Get access to email, passsword and passwordConfirmation
// First we defined our own middleware but since it has holes in its implementation we will use bodyParser node module.

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