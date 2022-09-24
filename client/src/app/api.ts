import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { Mutex } from 'async-mutex';
import { API_URL } from '../config/constants';
import { tokenReceived, loggedOut } from '../features/auth/auth.slice';
import { Token } from '../features/auth/types';

/* Create a new Mutex */
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token !== '') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  /* Wait until the mutex is available without locking it */
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    /* Check whether the mutex is locked */
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const queryResult = await baseQuery('auth/refresh', api, extraOptions);
        const token = queryResult.data as Token;
        if (token) {
          api.dispatch(tokenReceived(token));
          /* Retry the initial query */
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        /* Release must be called once the mutex should be released again */
        release();
      }
    } else {
      /* Wait until the mutex is available without locking it */
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['User', 'Task', 'Project'],
});
