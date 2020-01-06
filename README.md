# Asteroid data -api

[Graphql api](https://graphql.org/) to get near earth Asteroid information.

Data is fetched from [Nasa's open api (Asteroids NeoWs)](https://api.nasa.gov/).

## Running code

### Locally

1.  Copy `.env-sample` to `.env` and set needed values
2.  Install dependencies `yarn install`
3.  If needed, fetch new data with `yarn fetchData START_DATE END_DATE` where dates are in format `YYYY-MM-DD`. If no date parameters given, data of the current day will be fetched
4.  Run with nodemon `yarn dev` or without file watchers `yarn start`

### With Docker-compose

1.  Copy `.env-sample` to `.env` and set needed values
2.  Start container `docker-compose up -d`

## Development

This project uses lots of decorators by [Typeorm](https://typeorm.io/) and [TypeGraphql](https://typegraphql.ml/)

Because of typical graphql problem "n + 1 requests", [Dataloader](https://github.com/graphql/dataloader) is used for request batching

For dependency injection [Typedi](https://github.com/typestack/typedi)

## NOTES / Known problems

-   Using beta version of type-graphql, because it fixes nested validations bug, in real production app, beta version should be used with cautions
-   Diameter is saved only in meters. Converting to miles and feet isn't 100% accurate if using multiple decimals
-   Now using only SQLite database. This is okay for POC project, but in real production use should consider other options for reliability and performance, ex. Postgresql
-   Should calculate how long period is possible to get without reaching api request limits and maybe set some warning about that
-   Project is run with ts-node, but should consider building the app and running without ts-node, need webpack or something to handle path aliases

## TODO

-   More tests!!
-   Check and improve graphql query validations
-   Maybe run api fetching script with graphql mutation (then some authentication is needed!)
-   Get more data from nasa api
-   Implement grouping by year
-   More query filters, like get only asteroids bigger than x or get asteroids by name or id
