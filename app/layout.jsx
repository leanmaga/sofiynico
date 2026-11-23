import '@fontsource/passions-conflict/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import './globals.css';
import './papeleria.css';
export const viewport = {width:'device-width', initialScale:1, viewportFit:'cover', themeColor:'#e7dccb'};
export const metadata = { title: 'Sofi & Nico · Nuestra historia', description: 'Un libro para invitarte a nuestro casamiento.' };
export default function Layout({children}) {return <html lang="es-AR"><body>{children}</body></html>}