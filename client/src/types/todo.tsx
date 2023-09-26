export interface todoData {
	id: Number;
	name: string;
	completed: Boolean;
	archived: Boolean;
	created: string;
	modified: string;
	user_id: Number;
}

export interface todoState {
	todoList: Array<todoData>;
}
