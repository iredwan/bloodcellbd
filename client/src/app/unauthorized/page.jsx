import Link from "next/link";
import { FaLock } from "react-icons/fa";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <FaLock className="text-primary w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You are not authorized to view this page.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary/80 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
