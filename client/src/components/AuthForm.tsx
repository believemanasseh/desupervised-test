import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AuthFormProps } from '../types/props';

const AuthForm = (props: AuthFormProps) => {
	return (
		<StyledComponent>
			<h1 className='header'>{props.header}</h1>
			<form onSubmit={props.onSubmit}>
				<input name='email' type='text' placeholder='Email address' />
				<input name='password' type='password' placeholder='Password' />
				<input type='submit' value={props.submitBtnValue} />
			</form>
			<p>
				{props.footNote}{' '}
				<Link to={props.navigateTo}>{props.navigationComponentText}</Link>
			</p>
		</StyledComponent>
	);
};

const StyledComponent = styled.div`
	height: auto;
	width: 30vw;
	padding: 20px 0px;
	margin: auto;
	background-color: #41516b;
	text-align: center;

	.header {
		color: white;
	}

	form {
		display: flex;
		flex-flow: column nowrap;
		width: 80%;
		margin: auto;
	}

	input {
		margin: 10px;
		padding: 10px;
	}

	input[type='submit'] {
		background-color: #a8324c;
		color: white;
		font-size: 20px;
	}

	input[type='submit']:hover {
		cursor: pointer;
	}

	p,
	a {
		color: white;
	}
`;

export default AuthForm;
