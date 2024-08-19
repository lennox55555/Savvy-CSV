import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './RegistrationPage.css'
import googleLogo from '../../assets/Google_G_logo.svg.png'

const RegistrationPage: React.FC = () => {

    return (
        <Container fluid>
            <Row>
                <Col md={7} className='form-column'>
                    <div className='form-container'>
                        <div className='title'>
                            Create an account
                        </div>
                        <form className='sign-in-form'>
                            <div className='form-group'>
                                <input type='text' id='email' name='email' />
                                <div className='label'>Email address</div>
                            </div>
                            <div className='form-group'>
                                <input type='password' id='password' name='password' />
                                <div className='label'>Password</div>
                            </div>
                            <div className='form-group'>
                                <input type='password' id='password' name='password' />
                                <div className='label'>Confirm password</div>
                            </div>
                            <button type='submit'>Continue</button>
                        </form>
                        <div className='sign-up-link-container'>
                            <div className='sign-up-link'>
                                Already have account? <Link style={{ textDecoration: 'none' }} to='/signin'>Sign in</Link>
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