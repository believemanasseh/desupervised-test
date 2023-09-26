import toastr from 'toastr';
import { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Checkbox, Space, Button } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useDispatch, useSelector } from 'react-redux';

import {
	useFetchTodosQuery,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from './redux/features/api/todoSlice';
import { RootState } from './redux/store';
import { setTodoList, deleteTodoList } from './redux/features/todo/todoSlice';
import { validateErrors } from './utils';
import CustomArchiveIcon from './components/CustomArchiveIcon';
import CustomDeleteIcon from './components/CustomDeleteIcon';
import { todoData } from './types/todo';

export default function App(): JSX.Element {
	const dispatch = useDispatch();
	const todoList = useSelector((state: RootState) => state.todo.todoList);
	const navigate = useNavigate();
	const isLoggedIn = Cookies.get('isLoggedIn');
	const [inputValue, setInputValue] = useState<string>('');
	const [currentSlide, setCurrentSlide] = useState<Number>(1);
	const todos = useFetchTodosQuery();
	const [createTodoMutation] = useCreateTodoMutation();
	const [deleteTodoMutation] = useDeleteTodoMutation();
	const [updateTodoMutation] = useUpdateTodoMutation();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
		}

		if (todos?.data) {
			if (todoList.length === 0) {
				// Update todo list in redux store
				dispatch(setTodoList(todos.data));
			}
		}
	}, [todos]);

	const handleChange = async (e: CheckboxChangeEvent) => {
		e.preventDefault();
		try {
			const data: any = await updateTodoMutation({
				todoId: e.target.value,
				data: {
					completed: e.target.checked,
				},
			});
			const newTodo = updateTodo(
				data,
				e.target.value,
				e.target.checked,
				'completed'
			);
			dispatch(setTodoList(newTodo));
		} catch (err) {
			validateErrors(err);
		}
	};

	const updateTodo = (
		data: any,
		id: Number,
		value: Boolean,
		action: string
	): todoData[] | undefined => {
		if (data?.error) {
			validateErrors(data.error);
			return;
		}

		const msg =
			action === 'completed'
				? value
					? 'completed'
					: 'uncompleted'
				: 'archived';
		toastr.success(`Todo marked as ${msg}`, 'Success');

		const prevTodo = todoList.filter((todo) => todo.id !== id);
		const tempTodo = todoList.filter((todo) => todo.id === id)[0];
		const updatedValue =
			action === 'completed'
				? { ...tempTodo, completed: value }
				: { ...tempTodo, archived: value };
		const newTodo = [...prevTodo, updatedValue].sort(
			(a, b) => (a.id as number) - (b.id as number)
		); // sort todo list in ascending order
		return newTodo;
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInputValue(e.target.value);
	};

	const handleCreate = async () => {
		try {
			const data: any = await createTodoMutation({
				name: inputValue,
			});
			if (data?.error) {
				validateErrors(data.error);
				return;
			}
			toastr.success('Todo created successfully', 'Success');
			dispatch(setTodoList([...todoList, data.data]));
		} catch (err) {
			validateErrors(err);
		}
	};

	const handleUpdate = async (id: Number, value: Boolean) => {
		try {
			const data: any = await updateTodoMutation({
				todoId: id,
				data: {
					archived: value,
				},
			});
			const newTodo = updateTodo(data, id, value, 'archived');
			dispatch(setTodoList(newTodo));
		} catch (err) {
			validateErrors(err);
		}
	};

	const handleDelete = async (id: Number) => {
		try {
			const data: any = await deleteTodoMutation(id);
			if (data?.error) {
				validateErrors(data.error);
				return;
			}
			toastr.success('Todo deleted successfully', 'Success');
			dispatch(deleteTodoList(id));
		} catch (err) {
			validateErrors(err);
		}
	};

	return (
		<StyledComponent>
			{currentSlide === 1 ? (
				<>
					<div>
						<h1 className='header'>Todo List</h1>
					</div>
					<Input
						size='large'
						placeholder='search todos'
						prefix={<SearchOutlined />}
					/>
					<div className='todos'>
						{todoList
							.filter((todo) => todo.archived !== true)
							.map((value: todoData, index) => (
								<div key={index} className='todo-item'>
									<p>{value.name}</p>
									<span>
										<Checkbox
											checked={value ? (value.completed as boolean) : undefined}
											value={value.id}
											onChange={handleChange}
										/>
										<CustomDeleteIcon
											id={value.id}
											onClick={handleDelete}
											className='delete-btn'
										/>
										<CustomArchiveIcon
											id={value.id}
											onClick={handleUpdate}
											className='archive-btn'
										/>
									</span>
								</div>
							))}
					</div>
					<p className='archived' onClick={() => setCurrentSlide(2)}>
						Archived list
					</p>
					<Space.Compact style={{ width: '70%' }} size='large'>
						<Input
							value={inputValue}
							onChange={handleInputChange}
							placeholder='Add new todo'
							maxLength={50}
						/>
						<Button type='default' onClick={handleCreate}>
							Add
						</Button>
					</Space.Compact>
				</>
			) : (
				<div className='archived-list'>
					<h1 className='header'>Todo (Archived) List</h1>
					<div className='todos'>
						{todoList
							.filter((todo) => todo.archived === true)
							.map((value: todoData, index) => (
								<div key={index} className='todo-item'>
									<p>{value.name}</p>
									<span>
										<CustomDeleteIcon
											id={value.id}
											onClick={handleDelete}
											className='delete-btn'
										/>
									</span>
								</div>
							))}
					</div>
					<p className='archived' onClick={() => setCurrentSlide(1)}>
						Back to main list
					</p>
				</div>
			)}
		</StyledComponent>
	);
}

const StyledComponent = styled.div`
	height: auto;
	width: 30vw;
	padding: 20px;
	margin: auto;
	background-color: #41516b;
	text-align: center;

	.header {
		color: white;
	}

	.todos {
		margin: 20px;
	}

	.todo-item {
		display: flex;
		justify-content: space-between;
		background-color: #351054;
		color: white;
		border: 1px solid black;
		padding: 0px 20px;
	}

	.todo-item > p {
		font-size: 18px;
	}

	.todo-item > span {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.delete-btn,
	.archive-btn {
		cursor: pointer;
	}

	.archived {
		color: white;
		cursor: pointer;
		text-decoration: underline;
	}

	.archived:active {
		color: #351054;
	}
`;
