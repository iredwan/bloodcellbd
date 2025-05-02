import { Provider } from './Provider';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import TopLoaderWrapper from '../components/TopLoaderWrapper';
import { ToastContainer} from 'react-toastify';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BloodCellBD',
  description: 'Blood donation and request platform for Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
        <TopLoaderWrapper />
        <ToastContainer />
            <Navbar />
            <main className="min-h-screen">
        {children}
            </main>
        </Provider>
      </body>
    </html>
  );
}
