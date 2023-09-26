import { apiSlice } from './apiSlice';
import Cookies from 'js-cookie';

const todoAPI = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createTodo: builder.mutation({
			query: (data) => {
				const currentUser = JSON.parse(Cookies.get('currentUser')!!);
				const authToken = Cookies.get(`token_${currentUser.email}`);
				return {
					url: `/todos/create`,
					method: 'POST',
					body: data,
					headers: { Authorization: `${authToken}` },
				};
			},
		}),
		updateTodo: builder.mutation({
			query: ({ todoId, data }) => {
				const currentUser = JSON.parse(Cookies.get('currentUser')!!);
				const authToken = Cookies.get(`token_${currentUser.email}`);
				return {
					url: `/todos/${todoId}`,
					method: 'PATCH',
					body: data,
					headers: { Authorization: `${authToken}` },
				};
			},
		}),
		deleteTodo: builder.mutation({
			query: (todoId: Number) => {
				const currentUser = JSON.parse(Cookies.get('currentUser')!!);
				const authToken = Cookies.get(`token_${currentUser.email}`);
				return {
					url: `/todos/${todoId}`,
					method: 'DELETE',
					headers: { Authorization: `${authToken}` },
				};
			},
		}),
		fetchTodos: builder.query({
			query: (_arg: void) => {
				const currentUser = JSON.parse(Cookies.get('currentUser')!!);
				const authToken = Cookies.get(`token_${currentUser.email}`);
				return {
					url: `/todos`,
					method: 'GET',
					headers: { Authorization: `${authToken}` },
				};
			},
		}),
		searchTodos: builder.query({
			query: (value: string) => {
				const currentUser = JSON.parse(Cookies.get('currentUser')!!);
				const authToken = Cookies.get(`token_${currentUser.email}`);
				return {
					url: `/todos?search=${value}`,
					method: 'GET',
					headers: { Authorization: `${authToken}` },
				};
			},
		}),
	}),
});

export const {
	useCreateTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
	useFetchTodosQuery,
	useSearchTodosQuery,
} = todoAPI;
