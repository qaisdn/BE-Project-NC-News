## Project Overview

This Project is an API for a mini news article website written in JavaScript with ExpressJS and PostrgreSQL. Users can view articles and comment on them aswell as vote on any article. Other endpoints include deleting comments and having the abilty to sort articles by topic, date, comment count etc.

## Link to Hosted API

https://be-project-nc-news-16ce.onrender.com

## Setup guide

### Cloning the repository

To clone this repository run the following command in the terminal `git clone https://github.com/qaisdn/BE-Project-NC-News`

## Installing dependencies

To install required dependencies for this project use the command `npm install`
this will install the following dependencies:

- npm
- dotenv
- express
- supertest
- pg/format
- jest/sorted/extended
- husky
- nodemon

### Setting up Development & Test Environments

- Create a testing file called `.env.test` within this new file set up the test database with the script `PGDATABASE=nc_news_test `
- Create a development file called `.env.development` within this new file set up the dev database with the script `PGDATABASE=nc_news`

### Seeding the Databases

To seed the newly created databases run the commands

1. `npm run setup-dbs`
2. `npm run seed`

## Testing for this project

This project uses Jest to ensure all functions are passing to run tests use the command `npm test `

## Minimum versions of `Express`, `pg` and `Node.js` needed to run the project

- **Express** 4.21.1 or later
- **pg** 8.7.3 or later
- **Node.js**: 22.6.0 or later
