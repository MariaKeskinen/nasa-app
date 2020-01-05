import { Asteroid } from '@/entities/Asteroid'
import * as singleAsteroidData from '@/test-helpers/nasa-neo-feed-single-asteroid.json'

export class AsteroidMocker {
    public static mockAsteroid(): Asteroid {
        return Asteroid.fromApiData(singleAsteroidData)
    }

    public static mockAsteroids(amount = 5): Asteroid[] {
        return new Array(amount).fill(this.mockAsteroid())
    }
}
