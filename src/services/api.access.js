import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Manejo uniforme de errores
const handleApiError = (error) => {

	const errorStatus = error.response?.status;
	const message = error.response?.data.error

	if (errorStatus === 401) {
		throw message;
	}

	if (errorStatus === 403) {
		window.location.href = "/login";
	}
	throw error;
};

// Crear instancia de Axios
const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

// Interceptor para manejar errores
api.interceptors.response.use(
	response => response,
	error => {
		handleApiError(error);
		return Promise.reject(error);
	}
);

export default api;
