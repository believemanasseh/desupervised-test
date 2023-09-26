import { InboxOutlined } from '@ant-design/icons';
import { CustomArchiveProps } from '../types/props';

const CustomArchiveIcon = (props: CustomArchiveProps) => {
	return (
		<div
			className={props.className}
			onClick={() => props.onClick(props.id, true)}
		>
			<InboxOutlined />
		</div>
	);
};

export default CustomArchiveIcon;
