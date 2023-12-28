import { Logger, SetMetadata } from '@nestjs/common';
import * as _ from 'lodash';
import { config } from '../config';
import * as qs from 'qs';
import axios from 'axios';

export const getAuthorization = (request): string => {
  let authorization;
  if (request.header) {
    authorization = request.header('Authorization');
  } else {
    authorization = request.req.headers.authorization;
  }
  return authorization ?? '';
};

export interface CacheOptions {
  keyPrefix?: string;
  key?: string;
  ttl?: number;
  cacheNil?: boolean;
  onlyTenantPrefix?: boolean;
  noTenantPrefix?: boolean;
}

export const CacheValue = (options: CacheOptions) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const {
        key: optionKey,
        keyPrefix,
        ttl,
        cacheNil = true,
        onlyTenantPrefix = false,
        noTenantPrefix = false,
      } = options;
      const cacheKeyTenantPrefix = noTenantPrefix
        ? null
        : onlyTenantPrefix
        ? (this?.commonService || this)?.getCacheKeyTenantPrefix()
        : (this?.commonService || this)?.getCacheKeyTenantPartnerPrefix();

      let cacheKey = keyPrefix ? `${keyPrefix}:${args?.join('_')}` : optionKey;
      if (cacheKeyTenantPrefix) {
        cacheKey = `${cacheKeyTenantPrefix}:${cacheKey}`;
      }

      const cacheValue = await (this?.commonService || this).cacheManager.get(cacheKey);
      if (cacheValue) {
        Logger.debug(`${key} Hit Cache [${cacheKey}]`, target.constructor.name);
        return cacheValue;
      }

      const result = await originMethod.apply(this, args);

      if (!cacheNil && _.isNil(result)) {
        return result;
      }

      if (ttl) {
        await (this?.commonService || this).cacheManager.set(cacheKey, result, { ttl });
      } else {
        await (this?.commonService || this).cacheManager.set(cacheKey, result, {
          ttl: config.get('application.defaultCacheTime'),
        });
      }

      return result;
    };
    return descriptor;
  };
};

const maskKeys = [
  'rut',
  'cardnumber',
  'password',
  'phonenumber',
  'postalcode',
  'identificationid',
  'identification',
  'contactmediums',
  'token',
  'access_token',
  'id_token',
];
export const maskInfo = (key, value): string => {
  let maskedValue = value;
  if (maskKeys.includes(key.toLowerCase())) {
    if (value && value.length > 5) {
      maskedValue = '****' + maskedValue?.toString().substring(value.length - 4, value.length);
    } else {
      maskedValue = '****';
    }
  }
  return maskedValue;
};

export const maskedJsonStringify = (value: any): string => JSON.stringify(value, maskInfo);

export const maskRequestData = (value: any) => {
  if (!value) {
    return value;
  }

  const objValue = _.isString(value) ? qs.parse(value) : value;
  return maskedJsonStringify(objValue);
};

export const isServerSideError = (err): boolean => {
  return (
    axios.isAxiosError(err) && (!err.response || /^5\d{2}$/.test(err.response?.status.toString()))
  );
};

export const ApiScopes = (...apiScopes: string[]) => SetMetadata('apiScopes', apiScopes);
