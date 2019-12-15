import { Container } from 'typedi'

Container.set('nasaApiKey', process.env.NASA_API_KEY)
Container.set('nasaApiBaseUrl', process.env.NASA_API_BASE_URL)
