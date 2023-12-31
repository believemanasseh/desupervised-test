import { DeleteFilled } from '@ant-design/icons';
import { CustomDeleteProps } from '../types/props';

const CustomDeleteIcon = (props: CustomDeleteProps) => {
	return (
		<div className={props.className} onClick={() => props.onClick(props.id)}>
			<DeleteFilled />
		</div>
	);
};

export default CustomDeleteIcon;
