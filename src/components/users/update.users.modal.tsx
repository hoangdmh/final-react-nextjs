import { Form, Input, InputNumber, Modal, notification } from "antd";
import { useEffect } from "react";
import { IUser } from './users.table';

interface IProps {
  fetchUsers: () => Promise<void>;
  access_token: string;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  userSelected: IUser | null;
  setUserSelected: (v: IUser | null) => void;
}

const UpdateUserModal = (props: IProps) => {
  const {
    isUpdateModalOpen, setIsUpdateModalOpen,
    access_token,
    fetchUsers,
    userSelected, setUserSelected
  } = props;

  const [form] = Form.useForm();

  //set giá trị cho form
  useEffect(() => {
    if (userSelected) {
      //code
      form.setFieldsValue({
        name: userSelected.name,
        email: userSelected.email,
        age: userSelected.age,
        address: userSelected.address,
        role: userSelected.role,
        gender: userSelected.gender,
      })
    }
  }, [userSelected]);

  const handleCancel = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    //reset userSelected
    setUserSelected(null);
  };

  const onFinish = async (values: IUser) => {
    const { name, email, age, gender, role, address } = values;
    const payload = {
      _id: userSelected?._id,
      name, email, age, gender, role, address
    };
    //console.log('payload', payload);

    const response = await fetch('http://localhost:8000/api/v1/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      // body: JSON.stringify(payload),
      body: JSON.stringify({ ...payload }),
    });
    const d = await response.json();
    if (d.data) {
      //sau khi update thành công, fetch lại danh sách user
      await fetchUsers();

      notification.success({
        message: "Update user thành công.",
      })
      handleCancel();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message)
      })
    }
  };

  return (
    <>
      <Modal
        title="Update a user"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item
            style={{ marginBottom: 5 }}
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type='email' />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 5 }}
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please input your age!' }]}
          >
            <InputNumber
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please input your gender!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default UpdateUserModal;