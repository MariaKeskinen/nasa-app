**Monthly asteroids**

Get the largest asteroid (average diameter) by month between 1/2017 to 12/2019

```
query asteroids {
  asteroidsByMonth(start: {month: 1, year: 2017}, end: {month: 12, year: 2019}) {
    month
    year
    asteroidApproaches(limit: 1, sort: diameterAvg, sortDirection: desc) {
      date
      missDistance
      asteroid {
        nasaId
        neoReferenceId
        name
        nasaJplUrl
        absoluteMagnitudeH
        isPotentiallyHazardous
        estimatedDiameter {
          avg
        }
      }
    }
  }
}
```

or

```
query asteroids {
  asteroidsByMonth(start: {month: 1, year: 2017}, end: {month: 1, year: 2019}) {
    month
    year
    asteroids(limit: 1, sort: diameterAvg, sortDirection: desc) {
      nasaId
      neoReferenceId
      name
      nasaJplUrl
      absoluteMagnitudeH
      isPotentiallyHazardous
      estimatedDiameter {
        avg
      }
    }
  }
}
```
