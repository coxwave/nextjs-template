import got from 'got';
import Joi from 'joi';

// GET https://github.com/login/oauth/authorize
export const LoginResSchema = Joi.object({
  code: Joi.string().label('code').required(),
  state: Joi.string().label('state').required(),
});
export interface AuthorizationParams {
  client_id: string;
  redirect_url: string;
  state: string;
  login?: string;
  allow_signup?: string | boolean;
}

// POST https://github.com/login/oauth/access_token
export const loginWithGithub = async (
  params: GithubOauthLoginParam,
): Promise<GithubOauthLoginResult> => {
  const url = 'https://github.com/login/oauth/access_token';
  const headers = { Accept: 'application/json' };

  const tokenLoginResult = await got.post(url, { headers, json: params }).json<TokenLoginInfo>();
  const userInfo = await getUserInfo(tokenLoginResult.access_token);
  const email = await getUserEmail(tokenLoginResult.access_token);

  return {
    ...tokenLoginResult,
    ...userInfo,
    ...email,
  };
};

export type GithubOauthLoginParam = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
  state: string;
};
export type GithubOauthLoginResult = TokenLoginInfo & UserInfo & { email: string };

type TokenLoginInfo = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  refresh_token_expires_in: string;
  scope: string;
  token_type: string;
};

// Get information about the user with access token
const getUserInfo = async (access_token: string): Promise<UserInfo> => {
  const headers = {
    Authorization: `token ${access_token}`,
  };

  return await got
    .get('https://api.github.com/user', {
      headers,
    })
    .json<UserInfo>();
};

type UserInfo = {
  id: string;
  login: string;
  avatar_url: string;
};

// Get email of the user with access token
const getUserEmail = async (access_token: string): Promise<{ email: string }> => {
  const headers = {
    Authorization: `token ${access_token}`,
  };

  const [{ email }] = await got
    .get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
    .json();

  return { email };
};
