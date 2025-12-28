import { Layout } from './Layout';
import { SellerSidebar } from './SellerSidebar';

export const SellerLayout = ({ children }) => {
    return (
        <Layout>
            <div className="flex max-w-7xl mx-auto w-full">
                <SellerSidebar />
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </Layout>
    );
};
