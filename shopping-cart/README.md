From terminal command line:

"mkdir NodeShop" to create directory
"cd NodeShop" to change and go into directory NodeShop
"git init" to initialise git so it watches for file changes
"express shopping-cart --hbs" to scaffold up via express basic app with handlbars as the default templating engine
"cd shopping-cart" to change and go into the app directory
in the shopping-cart directory => "npm install --save express-handlebars" = this is node package manager install express-handlebars
as the default handlebars shipped with node is not sufficient.  Adding --save adds this dependency to the package.json file.
"node ./seed/product-seeder.js" to seed the database with initial products
"npm install csurf --save" to add csrf protection so that sessions cannot be stolen.  It adds a cookie so that session id must correspond
to the same browser id. --Save adds depending to package.json.
"npm install --save express-session" to add sessions for csrf protection to work.
"npm install --save passport" to install passport package for user login / sign up authentication
"npm install --save bcrypt-nodejs" to encrypt the password
"npm install --save connect-flash" for flash messages - so a message that can be shown in the view just for that session
"npm install --save passport-local" - local strategy for passport where it checks user information on local server;
could use google or facebook authentication instead - look up passport strategies to see the alternative methods and requirements
"npm install --save express-validator" to add validations for email and password logins etc
"npm install --save connect-mongo" to store session in mongodb rather than in memory which is better for production as memory
can have memory leaks.  The shopping cart will keep the items for a particular session and clear items when session is expired.


Must run mongo db:
navigate to binaries directory where mongodb is kept.  So in "/mongodb/bin" from command line run "./mongod" to start
database server;  by default it should use port:27017

From separate bash terminal:
From "/mongodb/bin" - run "./mongo" to run mongo client.  From command line "use shopping" to switch database to shopping database.


