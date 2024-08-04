import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import './SavvyService.css'

const SavvyService: React.FC = () => {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <>
            <Row>
                <Col className='md-10'>
                    <Row>
                        <Col>
                            <div className='savvy-title'>SavvyCSV</div>
                        </Col>
                        <Col>
                            <div className='username'>jonahmulcrone</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={() => setIsToggled(prevState => !prevState)} style={{ backgroundColor: 'transparent', border: 'none' }}>
                                <svg style={{ color: 'green', fontWeight: 'bold' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col md={2} className={`sidebar ${isToggled ? 'active' : 'hidden'}`}>
                    <div className='mb-3' style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', fontFamily: 'Roboto' }}>Search History</div>
                    <Row>
                        <Col>
                            <div className='search-date'>Today</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='search-prompt'>NVIDA 10-K filing 2023</div>
                            <div className='search-prompt'>Covid-19 infection rates fall 2021</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default SavvyService