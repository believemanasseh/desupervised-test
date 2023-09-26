import toastr from 'toastr';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegisterMutation } from '../redux/features/api/authSlice.ts';
import AuthForm from '../components/AuthForm';
import { validateErrors } from '../utils/index.tsx';

const Register = () => {
	const [registerMutation] = useRegisterMutation();
	const navigate = useNavigate();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		try {
			const data = await registerMutation({
				email: formData.get('email'),
				password: formData.get('password'),
			}).unwrap();
			if (data?.error) {
				validateErrors(data.error);
				return;
			}
			toastr.success('Registration successful', 'Success');
			navigate('/login');
		} catch (err) {
			validateErrors(err);
		}
	}

	return (
		<AuthForm
			header={'Register'}
			submitBtnValue={'Register'}
			footNote={'Already registered?'}
			navigateTo={'/login'}
			navigationComponentText={'Login'}
			onSubmit={handleSubmit}
		/>
	);
};

export default Register;
