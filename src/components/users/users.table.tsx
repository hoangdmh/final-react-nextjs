import { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import type { TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateUserModal from "./create.users.modal";

interface IUser {
  _id: string | number;
  name: string;
  email: string;
  role: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // login
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@gmail.com',
        password: '123456',
      }),
    });
    const d = await response.json();
    if (d.data) {
      localStorage.setItem("access_token", d.data.access_token);
    }

    // get all users
    const response2 = await fetch('http://localhost:8000/api/v1/users/all', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${d.data.access_token}`,
      },
    });
    const dataUser = await response2.json();
    // console.log(dataUser);
    setUsers(dataUser.data.result);
  }

  const columns: TableProps<IUser>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        return <a>{record.name}</a>
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => {
        return <Tag color="blue">{text}</Tag>
      }
    },
  ];

  const access_token = localStorage.getItem("access_token") as string;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>UsersTable page</h2>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey={(record) => record._id}
        loading={users.length > 0 ? false : true}
      />

      <CreateUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        access_token={access_token}
        fetchUsers={fetchUsers}
      />
    </>
  )
}

export default UsersTable;