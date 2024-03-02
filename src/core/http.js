import { navigate } from '../router/utils/navigate.js';

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

const refreshToken = async (url) => {
	const header = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
	};

	const refToken = localStorage.getItem('refreshToken');
	if (refToken) {
		try {
			const response = await window.fetch(url, {
				method: 'GET',
				headers: new window.Headers(header),
			});

			if (!response.ok) {
				if (response.status === 401) {
					console.error('Unauthorized: 401 error, refreshToken is expired');
					console.log('refreshToken has expired and requires re-login.');
					localStorage.clear();
					navigate('/login');
				}
			} else {
				const data = await response.json();
				localStorage.setItem('accessToken', data.accessToken);
				console.log('new acessToken:', data.accessToken);
			}
		} catch (error) {
			console.error('Network error:', error);
			return {
				status: 500,
				data: null,
			};
		}
	} else {
		console.error("refreshToken doesn't exist, so re-login is required.");
		localStorage.clear();
		navigate('/login');
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
		if (!response.ok) {
			if (response.status === 401) {
				console.error('Unauthorized: 401 error, accessToken is expired');
				await refreshToken(url);
				response = await window.fetch(url, config);
			}
		}
	} catch (error) {
		console.error('Network error:', error);
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
};
