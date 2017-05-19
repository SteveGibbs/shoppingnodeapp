# Node Shopping-Cart Website
[Click here to see live Project] Not yet deployed - available on //localhost:3000

## Description
A shopping cart website built with Node.js, Express and MongoDB (via Mongoose) to practice this framework.  The website is non-commercial and purely for educational purposes only.  

## Designed by
[Steve Gibbs](https://github.com/SteveGibbs)

## Features

#### Customers
1. Shopping cart to purchase product.  Customers must be logged in, via encrypted password, to complete checkout and pay via Stripe. 
2. Following checkout and payment, customers view their historical orders on the user profile page.  
- please use credit card, 4242 4242 4242 4242 with expiry 12 / 18 to make payments.  The expiry date must be in the future to validate via Stripe.  
3. Flash messages and field validations for incorrect data.  


#### Mobile responsive

- Mobile responsive, tested on chrome and safari using web developer tools.  

## Technology stack

[Node.js](https://nodejs.org/) v6.10.0 - event driven, Javascript runtime
[MongoDB](https://www.mongodb.com) - no SQL, database

- "dependencies": {
  -  "bcrypt-nodejs": "0.0.3",  - for password login encryption
  -  "body-parser": "~1.17.1",
  -  "connect-flash": "^0.1.1", - for pop-up flash messages
  - "connect-mongo": "^1.3.2",
  -  "cookie-parser": "~1.4.3",
  -  "csurf": "^1.9.0",  - for cross-site fraud prevention
  -  "debug": "~2.6.3",
  -  "express": "~4.15.2", - middleware to handle server calls
  -  "express-handlebars": "^3.0.0", - templating engine
  -  "express-session": "^1.15.2", - to handle sessions
  -  "express-validator": "^3.2.0", - to validate fields
  -  "hbs": "~4.0.1",
  -  "mongoose": "^4.9.8", - overlays Mongo for DB schemas
  -  "morgan": "~1.8.1",
  -  "passport": "^0.3.2",
  -  "passport-local": "^1.0.0",
  -  "serve-favicon": "~2.4.2",
  -  "stripe": "^4.19.0" - for credit card payment processing
  }
- [jQuery](https://jquery.com/) library
- JavaScript, HTML5 and CSS3 as programming languages

## New features under consideration
- Will extend models in Mongoose to have sub-products.  

## History of Building App (for my own reference)

From terminal command line:

- "mkdir NodeShop" to create directory
- "cd NodeShop" to change and go into directory NodeShop
- "git init" to initialise git so it watches for file changes
- "express shopping-cart --hbs" to scaffold up via express basic app with handlbars as the default templating engine
- "cd shopping-cart" to change and go into the app directory
in the shopping-cart directory => "npm install --save express-handlebars" = this is node package manager install express-handlebars
as the default handlebars shipped with node is not sufficient.  Adding --save adds this dependency to the package.json file.
- "node ./seed/product-seeder.js" to seed the database with initial products
- "npm install csurf --save" to add csrf protection so that sessions cannot be stolen.  It adds a cookie so that session id must correspond
to the same browser id. --Save adds depending to package.json.
- "npm install --save express-session" to add sessions for csrf protection to work.
- "npm install --save passport" to install passport package for user login / sign up authentication
- "npm install --save bcrypt-nodejs" to encrypt the password
- "npm install --save connect-flash" for flash messages - so a message that can be shown in the view just for that session
 - "npm install --save passport-local" - local strategy for passport where it checks user information on local server;
could use google or facebook authentication instead - look up passport strategies to see the alternative methods and requirements
- "npm install --save express-validator" to add validations for email and password logins etc
- "npm install --save connect-mongo" to store session in mongodb rather than in memory which is better for production as memory
can have memory leaks.  The shopping cart will keep the items for a particular session and clear items when session is expired.


Run mongo db separately:
- navigate to binaries directory where mongodb is kept.  So in "/mongodb/bin" from command line run "./mongod" to start
database server;  by default it should use port:27017
- from separate bash terminal navigate to "/mongodb/bin" then run "./mongo" to run mongo client.  From command line "use shopping" to switch database to shopping database.

Run 'npm start' from directory where app is saved to run locally. This runs the script 'node ./bin/www'. 
