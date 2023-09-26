import toastr from 'toastr';

export const validateErrors = (err: any) => {
	if (err?.data?.detail) {
		toastr.error(err.data.detail, 'Error');
		return;
	}
	if (err.status === 'FETCH_ERROR') {
		toastr.error('Fetch error', 'Error');
		return;
	}
};
