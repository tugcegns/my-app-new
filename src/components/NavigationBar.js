import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from "react-bootstrap";
import ExportDropdown from './ExportDropdown';

class NavigationBar extends React.Component{
    
    render (){

        return(
            <Navbar bg="dark" variant="dark" expand="lg" style={{ minHeight: '80px' }}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Navbar.Brand style={{ fontSize: '30px', fontWeight: 'bold' }}>Integrating Goal Models</Navbar.Brand>
                    <Nav className="mr-auto"></Nav>
                    <Nav className="ml-auto">
                        <ExportDropdown/>
                    </Nav>
                        
                        
                    </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;