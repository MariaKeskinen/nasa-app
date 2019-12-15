import { Query, Resolver } from 'type-graphql'
import { ApiService } from '@/nasa-api/ApiService'
import { Service } from 'typedi'
import { Asteroid } from '@/asteroids-neo/Asteroid'

@Service()
@Resolver()
export class NeoResolver {
    @Query(returns => Asteroid)
    async nearEarthAsteroids(): Promise<Asteroid> {
        const api = new ApiService()
        const response = await api.getNeoFeed('2015-09-07', '2015-09-08')
        console.log(response.data)
        const asteroid = response.data?.near_earth_objects?.['2015-09-08']?.[0]
        return Asteroid.fromApiData(asteroid)
    }
}
