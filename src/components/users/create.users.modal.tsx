import { Form, Input, InputNumber, Modal, notification } from "antd";

interface IProps {
  fetchUsers: () => Promise<void>;
  access_token: string;
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
}

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  role: string;
  address: string;
}

const CreateUserModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, access_token, fetchUsers } = props;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit()
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = async (values: UserFormValues) => {
    const { name, email, password, age, gender, role, address } = values;
    const payload = { name, email, password, age, gender, role, address };
    console.log('payload', payload)

    const response = await fetch('http://localhost:8000/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    });
    const d = await response.json();
    if (d.data) {
      //success
      await fetchUsers();
      
      notification.success({
        message: "Tạo mới user thành công.",
      })
      handleCancel();
    } else {
      ///
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message)
      })
    }
  };

  return (
    <>
      <Modal
        title="Add new user"
        open={isModalOpen}
        onOk={handleOk}
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
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
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
export default CreateUserModal;