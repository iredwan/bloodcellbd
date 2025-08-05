import { Provider } from './Provider';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopLoaderWrapper from '../components/TopLoaderWrapper';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BottomMenuBar from '@/components/BottomMenuBar';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata = {
  title: 'BloodCellBD',
  description: 'Blood donation and request platform for Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-50 dark:bg-gray-900`}>
        <Provider>
            <TopLoaderWrapper />
            <ToastContainer />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <BottomMenuBar />
            <Footer />
        </Provider>
      </body>
    </html>
  );
}
