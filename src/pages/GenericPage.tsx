// src/pages/GenericPage.tsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface GenericPageProps {
  title: string;
  description?: string;
  children?: ReactNode; // ✅ Add this line
}

const GenericPage: React.FC<GenericPageProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">{title}</h1>
        <p className="text-gray-600 text-lg text-center">
          {description || `This is the ${title} page. Content will be added here soon.`}
        </p>

        {children && <div className="mt-6 space-y-4">{children}</div>}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
