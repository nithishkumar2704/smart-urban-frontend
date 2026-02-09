import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                services: 'services.html',
                booking: 'booking.html',
                provider_dashboard: 'provider-dashboard.html',
                admin_dashboard: 'admin-dashboard.html',
                dashboard: 'dashboard.html',
                service_detail: 'service-detail.html',
                user: 'user.html',
                admin: 'admin.html',
                service_provider: 'service-provider.html'
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
