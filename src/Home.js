import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./components/NavigationBar";
import { Row, Col, Container } from "react-bootstrap";

class Home extends React.Component{
    render(){
        return(
            <div>
                <NavigationBar page="home"/>
                <Container className="mt-5">
                    <Row>
                        <Col md="12">
                            <h2 className="text-center">Welcome to Integrating Goal Models</h2>
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <p className="text-center" >
                                <a href="/playground">Let's Start</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Home;