/**
 * AWS Amplify Configuration for Face Liveness Detection
 * Configures Cognito Identity Pool for unauthenticated Rekognition access
 */

import { Amplify } from 'aws-amplify';

const identityPoolId = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID || '';
const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';

export function configureAmplify() {
  if (!identityPoolId) {
    console.warn('AWS Identity Pool ID not configured. Face liveness detection may not work.');
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        identityPoolId,
        allowGuestAccess: true,
      },
    },
  }, {
    ssr: false,
  });
}

export { identityPoolId, region };
