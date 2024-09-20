import { useEffect, useState } from "react";

interface IUser {
  _id: string | number;
  name: string;
  email: string;
  role: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);

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
    const data = await response.json();
    const token = data.data.access_token;
    // console.log(token);

    // get all users
    const response2 = await fetch('http://localhost:8000/api/v1/users/all', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const dataUser = await response2.json();
    // console.log(dataUser);
    setUsers(dataUser.data.result);
  }

  return (
    <>
      <h2>UsersTable page</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: IUser) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default UsersTable;