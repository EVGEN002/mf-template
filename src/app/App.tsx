import { getCurrentUser } from '@/api';
import Create from '@/views/Create';
import Detail from '@/views/Detail';
import DetailAdmin from '@/views/DetailAdmin';
import Edit from '@/views/Edit';
import { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppProps {
  id?: string;
  type: 'view' | 'view-admin' | 'create' | 'edit';
}

interface CurrentUser {
  role: string;
  name: string;
}

const App = ({ id, type }: AppProps) => {
  type ??= 'view';

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = ((await getCurrentUser()).data) as CurrentUser;

        setUserRole(data.role);
        // setUserRole("guest"); // TEST
      } catch {
        throw new Error('getCurrentUser error');
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {userRole && (
        <>
          {type === 'view' &&
            userRole !== 'admin' &&
            userRole !== 'operator' &&
            id && <Detail id={id} />}
          {type === 'view' &&
            (userRole === 'admin' || userRole === 'operator') &&
            id && <DetailAdmin id={id} />}
          {type === 'create' && <Create />}
          {type === 'edit' && id && <Edit id={id} />}
        </>
      )}
      <ToastContainer />
    </>
  );
};

export default App;
