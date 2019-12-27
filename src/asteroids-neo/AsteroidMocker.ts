import { Asteroid } from '@/asteroids-neo/Asteroid'
import * as singleAsteroidData from '@/test-helpers/nasa-neo-feed-single-asteroid.json'

export class AsteroidMocker {
    public static mockAsteroid(): Asteroid {
        return Asteroid.fromApiData(singleAsteroidData)
    }
}
