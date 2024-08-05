import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import './SavvyService.css'

const SavvyService: React.FC = () => {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <>
            <Row>
                <Col className='md-10'>
                    <Row className='header' style={{ background: 'white' }}>

                        <Col>
                            <Link to='/' style={{ textDecoration: 'none' }}>
                                <div className='savvy-title'>SavvyCSV</div>
                            </Link>
                        </Col>
                        <Col>
                            <div className={`username ${isToggled ? 'active' : 'inactive'}`}>jonahmulcrone</div>
                        </Col>

                    </Row>
                    { /* MAIN CONTENT */}
                    <Row>
                        <Col className='full-height' md={2}>
                            <div className='settings'>
                                <Row>
                                    <Col>
                                        <Button style={{ background: 'transparent', border: 'none', padding: '10px' }}>
                                            <svg style={{ color: '1D6F42' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" stroke={"currentColor"} strokeWidth={0.3} />
                                            </svg>
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            {/* CHAT BOT CONTAINER */}
                        </Col>
                        <Col md={1} className='sidebar-button' style={{ background: 'white' }}>
                            <Button style={{ fill: 'inherit', background: 'transparent', border: 'none' }} onClick={() => setIsToggled(prevState => !prevState)}>
                                {isToggled ? (
                                    <svg style={{ color: '#1D6F42' }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                                    </svg>
                                ) : (
                                    <svg style={{ color: '#1D6F42' }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223" />
                                    </svg>
                                )}
                            </Button>
                        </Col>
                    </Row>
                    { /* MAIN CONTENT */}
                </Col>

                <Col md={2} className={`sidebar ${isToggled ? 'active' : 'hidden'}`}>
                    <Row>
                        <Col>
                            <div className='mb-5' style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', fontFamily: 'Roboto' }}>Search History
                            </div>
                        </Col>
                    </Row>
                    <Row className='sidebar-content'>
                        <Col className='search-date'>
                            Today
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='search-prompt'>NVIDA 10-K filing 2023</div>
                            <div className='search-prompt'>Covid-19 infection rates fall 2021</div>
                        </Col>
                    </Row>
                    <div className='logout-button'>
                        <Row>
                            <Col>
                                Logout
                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="25" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" stroke="currentColor" strokeWidth={0.5} />
                                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" stroke="currentColor" strokeWidth={0.5} />
                                </svg>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default SavvyService