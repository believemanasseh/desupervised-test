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
