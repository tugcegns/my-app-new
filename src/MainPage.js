import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./components/NavigationBar";
import SideBar from "./components/SideBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "react-bootstrap";
import Playground from './components/Playground';


class MainPage extends React.Component{

    render (){

        return(
            <div>
                <NavigationBar/>
                <Row>
                    <Col md="2" style={{ overflow: 'auto' }}>
                        <SideBar  />
                    </Col>
                    <Col md="10" className="pt-3" >
                        <Playground/>
                    </Col>
                </Row>
                
            </div>
        );
    }
}

export default MainPage;