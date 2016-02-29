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
  * ```[sudo ]bower install --allow-root```
  * ```[sudo] grunt``` (to launch livereload) or ```npm start```
* Start app (there are 3 possible configurations: development (default), test and production):  
  * ```[export NODE_ENV=test ]npm start```
  * Run as daemon ```[export NODE_ENV=test ] && forever start app.js```
  

## Project Structure

 * /root

