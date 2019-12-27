import { Service } from 'typedi'
import { Asteroid } from '@/asteroids/Asteroid'
import { getRepository, Repository } from 'typeorm'

@Service()
export class AsteroidService {
    constructor(private readonly repository?: Repository<Asteroid>) {
        this.repository = repository || getRepository(Asteroid)
    }

    public async getAsteroids(): Promise<Asteroid[]> {
        return this.repository.find({})
    }
}
