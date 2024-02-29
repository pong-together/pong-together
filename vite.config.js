import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	server: {
		port: 3000,
	},
	define: {
		'process.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL),
		'process.env.VITE_SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL),
	},
});
