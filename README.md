# MoreGraspApp

## Installation

* Install and setup MongoDB (https://docs.mongodb.org/manual/installation/)
* Install node.js and npm 
  * Windows: https://nodejs.org/en/download/
  * Ubuntu/Debian: ```sudo apt-get update```; ```sudo apt-get install nodejs```; ```sudo apt-get install npm```
* Install global dependencies: ```[sudo] npm install -g bower grunt-cli forever```
* Clone or copy the repository
* Open a terminal/console, cd to MoreGraspApp/ and execute:
  * ```[sudo] npm install```
  * ```bower install --allow-root```
  * ```[sudo] grunt``` (to launch livereload) or ```npm start```
* Start app (there are 3 possible configurations: development (default), test and production):  
  * Set NODE_ENV variable ```[export NODE_ENV=test ]npm start``` in Linux or ```$env:NODE_ENV="test"``` in Windows
  * Run as daemon ```forever start app.js```
  

## Project Structure

 * /root

