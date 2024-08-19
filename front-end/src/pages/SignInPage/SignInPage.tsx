import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './SignInPage.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import googleLogo from '../../assets/Google_G_logo.svg.png'
import UserServiceAPI from '../../services/userServiceAPI';

const SignInPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await UserServiceAPI.getInstance().signInUser(formData);
            navigate('/savvycsv');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError('Incorrect email address or password.');
            } else {
                console.log('An error has occured.')
            }
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col md={7} className='form-column'>
                    <div className='form-container'>
                        <div className='title'>
                            Welcome to SavvyCSV
                        </div>
                        <Form className='sign-in-form' onSubmit={handleSubmit}>
                            <Form.Group className='form-group'>
                                <Form.Control
                                    type='text'
                                    name='email'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='label'>Email address</div>
                            </Form.Group>
                            <Form.Group className='form-group'>
                                <Form.Control
                                    type='password'
                                    name='password'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='label'>Password</div>
                            </Form.Group>
                            {
                                error &&
                                <p className="error-message">{error}</p>
                            }
                            <button type='submit'>Continue</button>
                        </Form>
                        <div className='sign-up-link-container'>
                            <div className='sign-up-link'>
                                Don't have account? <Link style={{ textDecoration: 'none' }} to='/register'>Sign up</Link>
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
};

export default SignInPage;
