import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Detail from '@/views/Detail';
import DetailAdmin from '@/views/DetailAdmin';
import Edit from '@/views/Edit';
import Create from '@/views/Create';
import LayoutSkeleton from '@/components/LayoutSkeleton';

import { getCurrentUser } from '@/api';

import 'react-toastify/dist/ReactToastify.css';

interface AppProps {
  id?: string;
  type: 'view' | 'view-admin' | 'view-user' | 'create' | 'edit';
}

const App = ({ id, type = 'view' }: AppProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const rUser = await getCurrentUser();

      if (rUser.success && rUser.data) {
        setUserRole(rUser.data.role);
      } else {
        console.error('Failed to fetch user:', rUser.error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (!userRole) return <LayoutSkeleton />;

    const isModerator = ['admin', 'operator'].includes(userRole);

    switch (type) {
      case 'view-admin':
        return id ? <DetailAdmin id={id} /> : null;

      case 'view-user':
        return id ? <Detail id={id} /> : null;

      case 'view':
        if (!id) return null;
        return isModerator ? <DetailAdmin id={id} /> : <Detail id={id} />;

      case 'create':
        return <Create />;

      case 'edit':
        return id ? <Edit id={id} /> : null;

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      <ToastContainer />
    </>
  );
};

export default App;
