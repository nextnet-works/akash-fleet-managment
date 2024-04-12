export const COMMANDS = {
  DEPLOY:
    'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',

  BIDS: 'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',

  ACCEPT_BID:
    'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',

  CLOSE_DEPLOYMENT:
    'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',

  GET_DEPLOYMENT_STATUS:
    'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',

  SEND_DEPLOYMENT_MANIFEST:
    'provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash',
} as const;
