import toastr from 'toastr';
import Cookies from 'js-cookie';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '../components/AuthForm';
import { useLoginMutation } from '../redux/features/api/authSlice';
import { validateErrors } from '../utils';

const Login = () => {
	const navigate = useNavigate();
	const [loginMutation] = useLoginMutation();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		// Set cookie expiry date. Expires after 2 hours
		const expiryDate = new Date();
		expiryDate.setTime(expiryDate.getTime() + 2 * 60 * 60 * 1000);

		try {
			const data: any = await loginMutation({
				email: formData.get('email'),
				password: formData.get('password'),
			});

			if (data.error) {
				validateErrors(data.error);
				return;
			}
			toastr.success('Login successful', 'Success');
			Cookies.set(`token_${data?.data?.email}`, data?.data?.auth_token, {
				expires: expiryDate,
				sameSite: 'strict',
			});
			Cookies.set(
				'currentUser',
				JSON.stringify({
					id: data?.data?.id,
					email: data?.data?.email,
				}),
				{
					expires: expiryDate,
					sameSite: 'strict',
				}
			);
			Cookies.set('isLoggedIn', JSON.stringify(true), {
				expires: expiryDate,
				sameSite: 'strict',
			});
			navigate('/');
		} catch (err) {
			validateErrors(err);
		}
	}

	return (
		<AuthForm
			header={'Login'}
			submitBtnValue={'Login'}
			footNote={'Not yet registered?'}
			navigateTo={'/register'}
			navigationComponentText={'Register'}
			onSubmit={handleSubmit}
		/>
	);
};

export default Login;
