**Closest asteroid**

Get asteroid, that passed the closest to Earth between 2015-12-19 and 2015-12-26

```
query asteroids {
  asteroids(filter: { startDate: "2015-12-19", endDate: "2015-12-26" }, sort: distance, sortDirection: asc, limit: 1) {
    id
    nasaId
    name
    absoluteMagnitudeH
    estimatedDiameter {
      avg
    }
    isPotentiallyHazardous
    closeApproachData {
      date
      relativeVelocity
      missDistance
      orbitingBody
    }
  }
}
```
