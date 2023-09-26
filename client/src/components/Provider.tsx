import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store';

export default function Provider(props: PropsWithChildren) {
	return <ReduxProvider store={store}>{props.children}</ReduxProvider>;
}
