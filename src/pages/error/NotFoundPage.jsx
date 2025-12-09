import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Layout } from "../../components/layout/Layout";

export const NotFoundPage = () => {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Sorry, the page you're looking for doesn't exist.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}