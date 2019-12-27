import { Service } from 'typedi'
import { getRepository, Repository } from 'typeorm'
import { Asteroid } from '@/asteroids/Asteroid'

@Service()
export class AsteroidService {
    constructor(private readonly repository?: Repository<Asteroid>) {
        this.repository = this.repository || getRepository(Asteroid)
    }

    public async getAsteroids(): Promise<Asteroid[]> {
        return this.repository.find({ relations: ['closeApproachData'] })
    }
}
