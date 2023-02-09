import { MixinApi } from '@mixin.dev/mixin-node-sdk';
import { ls } from '@/utils/localStorage';
import { userCbFactory, botCbFactory } from './config';

export const useUserClient = ($message, t) => {
  const defaultApiConfig = {
    requestConfig: {
      responseCallback: userCbFactory($message, t),
    },
  };

  const keystore = {"user_id":"fbd26bc6-3d04-4964-a7fe-a540432b16e2","scope":"PROFILE:READ APPS:READ APPS:WRITE","authorization_id":"756ef612-e7f1-44e0-977c-ab875f822f29","private_key":"ShGg4PdoHy9ZQdWfQFlm0kPKHnY1M3EhXRrrg5iFZfJEuhtDXDu5sQ1l8tdA-P1RKQKcSp5a2unutLybs8CH5A"};
  const config = (
    keystore
    && !!keystore.user_id
    && !!keystore.private_key
    && !!keystore.scope
    && !!keystore.authorization_id
  )
    ? {
      ...defaultApiConfig,
      keystore,
    }
    : defaultApiConfig;
  return MixinApi(config);
};

export const useBotClient = ($message, t, keystore, onError = undefined) => {
  const defaultApiConfig = {
    requestConfig: {
      responseCallback: botCbFactory($message, t, onError),
    },
  };

  const config = (
    keystore
    && !!keystore.user_id
    && !!keystore.private_key
    && !!keystore.session_id
    && !!keystore.pin_token
  )
    ? {
      ...defaultApiConfig,
      keystore,
    }
    : defaultApiConfig;
  return MixinApi(config);
};
