<template>
  <div></div>
</template>

<script>
import { getED25519KeyPair } from '@mixin.dev/mixin-node-sdk';
import { getUrlParameter, ls } from '@/utils';
import { useUserClient } from '@/api';
import { useRouter } from 'vue-router';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: ['client', 'setKeystore'],
  // eslint-disable-next-line consistent-return
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const $message = inject('$message');

    const useAccessDenied = () => {
      $message.error({
        message: t('message.errors.403'),
        showClose: true,
      });
      location.href = 'https://developers.mixin.one/'
    };

    const error = getUrlParameter('error');
    if (error === 'access_denied') return useAccessDenied();

    const code = getUrlParameter('code');
    const { privateKey, publicKey } = getED25519KeyPair();

    const client = useUserClient($message, t);
    client.oauth.getToken(
      process.env.VUE_APP_CLIENT_ID,
      code,
      publicKey,
      // eslint-disable-next-line consistent-return
    ).then((resp) => {
      if (!resp) return useAccessDenied();

      const { scope, authorization_id } = resp;
      if (
        !scope
        || scope.indexOf('APPS:READ') < 0
        || scope.indexOf('APPS:WRITE') < 0
      ) return useAccessDenied();

      const keystore = {
        user_id: process.env.VUE_APP_CLIENT_ID,
        scope,
        authorization_id,
        private_key: privateKey,
      };
      ls.set('token', keystore);

      router.push('/dashboard');
    });
  },
};
</script>

<style>
</style>
