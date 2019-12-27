# Asteroid data -api

Graphql api to get near earth Asteroid information.

Data is fetched from [Nasa's open api (Asteroids NeoWs)](https://api.nasa.gov/).

# NOTES / Known problems

-   Diameter is saved only in meters. Converting to miles and feet isn't 100% accurate if using multiple decimals.
