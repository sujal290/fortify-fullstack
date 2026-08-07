// PATH: client/src/app/addresses/page.js  (NEW FILE)
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddressBook from '@/components/AddressBook';

export default function AddressesPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-3xl mx-auto px-7"><h1 className="font-display text-3xl">My Addresses</h1></div>
      </div>
      <div className="max-w-3xl mx-auto px-7 py-11">
        <ProtectedRoute>
          <AddressBook />
        </ProtectedRoute>
      </div>
    </MainLayout>
  );
}