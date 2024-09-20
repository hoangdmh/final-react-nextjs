import { useState } from 'react';
import { Link } from "react-router-dom";

import { TeamOutlined, FireOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
  {
    label: <Link to={'/'}>Home</Link>,
    key: 'home',
    icon: <FireOutlined />,
  },
  {
    label: <Link to='/users'>Manage Users</Link>,
    key: 'users',
    icon: <TeamOutlined />,
  },

];

const Header = () => {
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
