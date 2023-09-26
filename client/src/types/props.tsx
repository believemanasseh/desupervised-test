import { FormEvent } from 'react';

export interface CustomDeleteProps {
	onClick: (id: Number) => void;
	id: Number;
	className: string;
}

export interface CustomArchiveProps {
	onClick: (id: Number, value: Boolean) => void;
	id: Number;
	className: string;
}

export interface AuthFormProps {
	header: string;
	submitBtnValue: string;
	footNote: string;
	navigateTo: string;
	navigationComponentText: string;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
