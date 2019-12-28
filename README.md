# Asteroid data -api

Graphql api to get near earth Asteroid information.

Data is fetched from [Nasa's open api (Asteroids NeoWs)](https://api.nasa.gov/).

# NOTES / Known problems

-   Using beta version of type-graphql, because it fixes nested validations bug, in real production app, beta version should be used with cautions
-   Diameter is saved only in meters. Converting to miles and feet isn't 100% accurate if using multiple decimals.
