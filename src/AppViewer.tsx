import App from '@/app/App';

import './AppViewer.css';

const AppViewer = () => {
  return (
    <div>
      <div className="h-[5vh] bg-[#494949] px-8"></div>
      {/* <App type="edit" id="c9bcf574-9bc0-4223-a07b-a3cb35a239fd" /> */}
      {/* <App type="edit" id="e4a1873d-8301-4714-ae04-d4913128e1b4" /> */}
      <App type="view" id="e4a1873d-8301-4714-ae04-d4913128e1b4" />
    </div>
  );
};

export default AppViewer;
