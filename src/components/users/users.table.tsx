import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, notification } from "antd";
import type { TableProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateUserModal from "./create.users.modal";
import UpdateUserModal from "./update.users.modal";

export interface IUser {
  _id: string | number;
  name: string;
  email: string;
  role: string;
  address: string;
  gender: string;
  password: string;
  age: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<IUser | null>(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 7,
    pages: 0,
    total: 0
  });
  const access_token = localStorage.getItem("access_token") as string;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // get all users
    const response2 = await fetch(`http://localhost:8000/api/v1/users/all?page=${meta.current}&limit=${meta.pageSize}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    });
    const dataUser = await response2.json();
    console.log(dataUser);
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
    {
      title: 'Action',
      key: 'action',
      render: (value, record: IUser) => {
        return (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button icon={<EditOutlined />} onClick={() => handleUpdateUser(record)}>Edit</Button>
            <Popconfirm
              title="Delete user"
              description={`Are you sure delete ${record.name} ?`}
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger ghost icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          </div>
        )
      }
    },
  ];

  const handleUpdateUser = (record: IUser) => {
    //console.log('check record', record);
    setIsUpdateModalOpen(true);
    setUserSelected(record);
  }

  const confirm = async (record: IUser) => {
    //console.log('check record', record);
    const id = record._id;
    const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    });
    const d = await response.json();
    if (d.data) {
      //sau khi delete, fetch lại danh sách user
      await fetchUsers();

      notification.success({
        message: `Delete ${record.name} success`,
      })
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message)
      })
    }
  };

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
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            console.log('check page pageSize', page, pageSize);
            setMeta({ ...meta, current: page, pageSize: pageSize });
          },
        }}
      />

      <CreateUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        access_token={access_token}
        fetchUsers={fetchUsers}
      />

      <UpdateUserModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        access_token={access_token}
        fetchUsers={fetchUsers}
        userSelected={userSelected}
        setUserSelected={setUserSelected}
      />
    </>
  )
}

export default UsersTable;