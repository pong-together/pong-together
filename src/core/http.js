const BASE_URL = import.meta.env.VITE_BASE_URL;
const REFRESH_BASE_URL = `${BASE_URL}/api/auth/token/refresh/`;
const CHECK_BASE_URL = `${BASE_URL}/api/auth/otp/`;

const parseResponse = async (response) => {
	const { status } = response;
	let data = null; // 초기값을 null로 설정
	try {
		if (status !== 204) {
			data = await response.json();
		}
	} catch (error) {
		//console.error('Error parsing response:', error);
		// data는 null로 유지됩니다.
	}

	return {
		status,
		data,
	};
};

const checkToken = async () => {
	let header = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
	};

	try {
		const response = await window.fetch(CHECK_BASE_URL, {
			method: 'GET',
			headers: new window.Headers(header),
		});
		console.log('status:', response.status);
		if (!response.ok) {
			if (response.status === 401) {
				console.log('Unauthorized: 401, accessToken is expired');
				await refreshToken();
			}
		}
	} catch (error) {
		console.log('checkToken error');
		return {
			status: error.status,
			message: error.message,
		};
	}
};

const refreshToken = async () => {
	let header = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
	};
	let refBody = {
		refresh: localStorage.getItem('refreshToken'),
	};
	refBody = JSON.stringify(refBody);

	const refToken = localStorage.getItem('refreshToken');
	if (refToken) {
		try {
			const response = await window.fetch(REFRESH_BASE_URL, {
				method: 'POST',
				headers: new window.Headers(header),
				body: refBody,
			});
			console.log('status:', response.status);
			if (!response.ok) {
				if (response.status === 401) {
					console.log('Unauthorized: 401, refreshToken is expired');
					console.log('refreshToken has expired and requires re-login');
					localStorage.clear();
					window.location.pathname = '/login';
				}
			} else {
				const data = await response.json();
				localStorage.setItem('accessToken', data.access);
				console.log('accessToken reissued');
			}
		} catch (error) {
			console.log('refreshToken error');
			return {
				status: error.status,
				message: error.message,
			};
		}
	} else {
		console.log("refreshToken doesn't exist, so re-login is required");
		localStorage.clear();
		window.location.pathname = '/login';
	}
};

const request = async (params) => {
	const { method = 'GET', url, headers = {}, body } = params;
	let response;
	const config = {
		method,
		headers: new window.Headers(headers),
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	try {
		response = await window.fetch(url, config);
		console.log('status:', response.status);
		if (!response.ok) {
			if (response.status === 401) {
				console.log('Unauthorized: 401, accessToken is expired');
				await refreshToken();
				response = await window.fetch(url, config);
			}
		}
	} catch (error) {
		console.log('Network error:', error);
		return {
			status: 500, // 예시로 500 상태 코드를 반환
			data: null, // 데이터는 없음
		};
	}

	return parseResponse(response);
};

const get = async (url, headers) => {
	const response = await request({
		url,
		headers,
		method: 'GET',
	});

	return response.data;
};

const post = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'POST',
		body,
	});
	return response.data;
};

const put = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'PUT',
		body,
	});
	return response.data;
};

const patch = async (url, body, headers) => {
	const response = await request({
		url,
		headers,
		method: 'PATCH',
		body,
	});
	return response.data;
};

const deleteRequest = async (url, headers) => {
	const response = await request({
		url,
		headers,
		method: 'DELETE',
	});
	return response.data;
};

export default {
	get,
	post,
	put,
	patch,
	delete: deleteRequest,
	checkToken,
};
