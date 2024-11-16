import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		port: 1339,
		open: '/',
	},
	build: {
		target: 'esnext',
	},
	optimizeDeps: {
		disabled: true,
	},
})
