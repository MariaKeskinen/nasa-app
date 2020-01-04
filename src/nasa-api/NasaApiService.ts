import { Container, Service } from 'typedi'
import axios from 'axios'

export enum API_TYPES {
    FEED = 'feed',
    LOOKUP = 'neo',
    BROWSE = 'browse'
}

@Service()
export class NasaApiService {
    public async getNeoFeed(startDate: string, endDate: string): Promise<Record<string, any>> {
        return this.get(API_TYPES.FEED, {
            start_date: startDate,
            end_date: endDate
        })
    }

    private async get(
        type: API_TYPES,
        params: Record<string, string>
    ): Promise<Record<string, any>> {
        const queryString = this.parseQueryString(params)
        const fullUrl = `${Container.get('nasaApiBaseUrl')}/${type}?${queryString}`
        const response = await axios.get(fullUrl)

        return response.data
    }

    private parseQueryString(params: Record<string, string>): string {
        let queryString = ''
        for (let param in params) {
            queryString += `&${param}=${params[param]}`
        }

        queryString += `&api_key=${Container.get('nasaApiKey')}`

        return queryString.replace('&', '')
    }
}
