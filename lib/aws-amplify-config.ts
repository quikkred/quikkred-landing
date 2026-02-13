import { Amplify } from "aws-amplify";

// Configure AWS Amplify for Face Liveness
// Note: These credentials should come from your backend or environment variables
export const configureAmplify = (identityPoolId?: string, region: string = "ap-south-1") => {
  if (!identityPoolId) {
    console.warn("AWS Identity Pool ID not provided. Face Liveness will not work without proper authentication.");
    return;
  }

  Amplify.configure({
    Auth: {
      identityPoolId: identityPoolId,
      region: region
    }
  });

  console.log("✅ AWS Amplify configured for Face Liveness");
};

// Optional: Configure with Cognito User Pool (if you're using Cognito for auth)
export const configureAmplifyWithCognito = (config: {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
  region: string;
}) => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.userPoolId,
        userPoolClientId: config.userPoolClientId,
        identityPoolId: config.identityPoolId,
      },
      region: config.region
    }
  });

  console.log("✅ AWS Amplify configured with Cognito");
};
