import React, { useState } from 'react';

import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './RegistrationPage.css'
import googleLogo from '../../assets/Google_G_logo.svg.png'
import UserServiceAPI from '../../services/userServiceAPI';

const RegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState('')
    const [accountCreated, setAccountCreated] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();

        if (formData.password != formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await UserServiceAPI.getInstance().registerUser(formData);
            setError('')
            setAccountCreated('Account successfully created.')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error has occured!')
            }
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col md={7} className='form-column'>
                    <div className='form-container'>
                        <div className='title'>
                            Create an Account
                        </div>
                        <Form className='sign-in-form' onSubmit={handleSubmit}>
                            <Form.Group className='form-group' controlId='email'>
                                <Form.Control
                                    className='email-input'
                                    type='text'
                                    name='email'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='label'>Email address</div>
                            </Form.Group>
                            <Form.Group className='form-group' controlId='password'>
                                <Form.Control
                                    className='password-input'
                                    type='password'
                                    name='password'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='label'>Password</div>
                            </Form.Group>
                            <Form.Group className='form-group' controlId='confirmPassword'>
                                <Form.Control
                                    className='password-input'
                                    type='password'
                                    name='confirmPassword'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='label'>Confirm password</div>
                            </Form.Group>
                            {
                                accountCreated &&
                                <p className='success-message'>{accountCreated}</p>
                            }
                            {
                                error &&
                                <p className="error-message">{error}</p>
                            }
                            <button type='submit'>Continue</button>
                        </Form>
                        <div className='sign-up-link-container'>
                            <div className='sign-up-link'>
                                Already have an account? <Link style={{ textDecoration: 'none' }} to='/signin'>Sign in</Link>
                            </div>
                        </div>
                        <hr className='divider' />

                        <button className='google-button'>
                            <img src={googleLogo} alt="Google logo" className='google-logo' />
                            Continue with Google
                        </button>
                    </div>
                </Col>
                <Col md={5} className='blank-column'>
                    {/* Blank canvas */}
                </Col>
            </Row>
        </Container>
    );
}

export default RegistrationPage