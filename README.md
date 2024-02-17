<h1 align="center">TebexifyDiscord</h1>
<p align ="center">Tebexify | Tebex -> Discord purchase events.</p>

<h2 align="left">Getting started using Pterodactyl</h2>

### Create your NodeJS server on your Panel

1. Under "Nest Configuration" select "nodejs" as your Nest

2. Ensure that you are using Nodejs v20 as your Docker image, 
by checking "Docker Configuration"  

### **No nodejs Nest?**

1. Click Nest under "Service Management" in your pterodactyl admin panel.
2. Click "Create new"
3. Call it Nodejs
> Must be made to associate the imported egg to a Nest.

5. Download the Nest egg from: <a>https://github.com/parkervcp/eggs/blob/master/generic/nodejs/egg-node-js-generic.json</a>
6. Click Import Egg
7. Select the Egg File
8. Select the newly created Nodejs Nest as the associating Nest.

You can now follow the previous steps!

### Configuring Service Variables
1. Find Git Repo Address and paste this repository
2. Put "main" as the install branch.
3. Put your github username under git
4. Create a personal Git Access Token (<a>https://github.com/settings/tokens</a>) and paste it in the field "Git Access Token"

### We're done!
Click "Create Server" and wait for it to install.


### Configuring config.json
1. Firstly, change the name from **example.config.json** to **config.json**
2. Fill out the missing values
3. Make sure a port has been opened & filled out.

Note that this is written to run behind a reverse proxy (in my case I am using Traefik), and as such we are accepting all internally forwarded payloads.
**If you are NOT using a reverse proxy with some sort of filtering or validation, please proceed with caution**
Configuring this is outside the scopes of this project, and requires Linux system administration experience.

### The app should now be running, and your discord bot should be online.

### DNS
1. Route your domain (I am using webhook.__.__) to send payload => express server

### Validating Webhooks

Tebexify listens for a webhook payload sent by Tebex, and to prevent abuse, Tebex wants the server to validate
that we're supposed to be sending these payloads.

This is done by returning Status 200 ("OK") to Tebex, and the recieved payloads id within the body of the response.
Once recieved, the app takes the id & returns the Status 200. 

> In this instance, we've set our express app to listen on ./tebex/webhook
and as such, our router needs to follow the same scheme.

1. Head to your tebex Dashboard, and navigate to the Webhook panel.
2. Click Endpoints and create a new Endpoint
3. In the address, we'll set the address from before. (***YOU MUST use https:// or it will not validate your domain***)
4. Select "Purchase Completed"

> Tebex will automatically check and validate the webhook assuming you've done it correctly.
Note: after 3 failed attempts, the endpoint will be disabled within 7 days, if further attempts are not sucessfull. In such instances, reply back that it was intentional, and create a new endpoint for the time being.

