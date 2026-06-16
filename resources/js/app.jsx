import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./features/**/*.jsx', { eager: true })
        return pages[`./features/${name}.jsx`].default
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})