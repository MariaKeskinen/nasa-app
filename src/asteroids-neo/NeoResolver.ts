import { Query, Resolver } from 'type-graphql'

@Resolver()
export class NeoResolver {
    @Query(returns => String)
    async nearEarthAsteroids(): Promise<string> {
        return 'hiphip'
    }
}
