import { baseApi } from '../../app/api';
import { DecodedTokenPayload, LoginInput, RegisterInput, Token } from './types';
import jwtDecode from 'jwt-decode';
import { loggedOut, setCredentials } from './auth.slice';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<void, RegisterInput>({
      query: registerInput => ({
        url: 'auth/register',
        method: 'POST',
        body: registerInput,
      }),
    }),
    login: builder.mutation<Token, LoginInput>({
      query: loginInput => ({
        url: 'auth/login',
        method: 'POST',
        body: loginInput,
      }),
      async onQueryStarted(loginInput, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        const decoded: DecodedTokenPayload = jwtDecode(data.accessToken);

        dispatch(setCredentials({ token: data.accessToken, currentUser: decoded.user }));
        // error will be handled in Login component
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(loggedOut());
        dispatch(baseApi.util.resetApiState());
        // error will be handled in React component
      },
    }),
  }),
});
