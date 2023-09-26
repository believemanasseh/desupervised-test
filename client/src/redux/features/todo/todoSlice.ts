import { createSlice } from '@reduxjs/toolkit';
import { todoState } from '@/types/todo';

export const todoInitialState: todoState = {
	todoList: [],
};

const slice = createSlice({
	name: 'todo',
	initialState: todoInitialState,
	reducers: {
		setTodoList: (state, action) => {
			state.todoList = action.payload;
		},
		deleteTodoList: (state, action) => {
			state.todoList = state.todoList.filter(
				(todo) => todo.id !== action.payload
			);
		},
	},
});

export const { setTodoList, deleteTodoList } = slice.actions;

export default slice.reducer;
