import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../apollo/mutations'; // Import LOGIN_USER mutation
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import type { User } from '../models/User';

const LoginForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<User>({
    username: '',
    email: '',
    password: '',
  //  savedBooks: [],
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Apollo mutation hook for login
  const [login] = useMutation(LOGIN_USER);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Perform login mutation using Apollo Client
      const { data } = await login({
        variables: {
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      // Assuming `data.loginUser` returns a token and user data
      const { token } = data.login;
      Auth.login(token); // Save the token to local storage or cookies

      // Close the modal (if applicable)
      handleModalClose();
    } catch (err) {
      console.error(err);
      setShowAlert(true); // Display error alert
    }

    // Reset form data
    setUserFormData({
      username: '',
      email: '',
      password: '',
    //  savedBooks: [],
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;