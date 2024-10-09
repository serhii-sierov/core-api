import { NON_PRODUCTION_ENVIRONMENTS } from '@constants';
import { AppConfigService } from 'modules/shared/modules/config/config.service';

export const isProduction = (config: AppConfigService) => {
  const environment = config.get('NODE_ENV');

  return environment && !NON_PRODUCTION_ENVIRONMENTS.includes(environment);
};
