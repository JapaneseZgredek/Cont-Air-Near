import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import UserPanel from '../components/UserPanel/UserPanel';

const UserPanelPage = () => {
  return (
    <div className='form-page'>
      {/*<NavbarComponent />*/}
      <UserPanel />
    </div>
  );
};

export default UserPanelPage;