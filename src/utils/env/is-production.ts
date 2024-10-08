import { NON_PRODUCTION_ENVIRONMENTS } from '@constants';
import { TypedConfigService } from 'modules/shared/modules/config/config.service';

export const isProduction = (config: TypedConfigService) => {
  const environment = config.get('NODE_ENV');

  return environment && !NON_PRODUCTION_ENVIRONMENTS.includes(environment);
};
