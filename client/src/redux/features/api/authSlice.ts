import { apiSlice } from './apiSlice';

const authenticationAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: `/register`,
				method: 'POST',
				body: data,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: `/login`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const { useRegisterMutation, useLoginMutation } = authenticationAPI;
