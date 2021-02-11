import { EnvironmentConfigServices } from '../interfaces/environment.config'
import { getConfigValue } from './index'
import {
    SERVICES_CCD_COMPONENT_API_PATH,
    SERVICES_CCD_DATA_STORE_API_PATH,
    SERVICES_IDAM_LOGIN_URL,
    SERVICES_TERMS_AND_CONDITIONS_URL,
    SERVICE_S2S_PATH,
} from './references'

export const healthEndpoints = (): EnvironmentConfigServices => {
    const HEALTH = '/health'

    return {
        ccdComponentApi: `${getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)}${HEALTH}`,
        ccdDataApi: `${getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)}${HEALTH}`,
        idamApi: `${getConfigValue(SERVICES_IDAM_LOGIN_URL)}${HEALTH}`,
        s2s: `${getConfigValue(SERVICE_S2S_PATH)}${HEALTH}`,
        termsAndConditions: `${getConfigValue(SERVICES_TERMS_AND_CONDITIONS_URL)}${HEALTH}`,
    }
}
