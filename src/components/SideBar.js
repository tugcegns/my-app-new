import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

import  htmlToImage from 'html-to-image';
import  download  from 'downloadjs';
import ImportDataModal from "./ImportDataModal";
class SideBar extends React.Component{
    
    render(){
        return(
            <div style={{
                width: '100%',
                backgroundColor: '#e1e1e1',
                paddingTop: '20px',
                height: '100%',
                boxShadow: '4px 2px 5px 0px #a1a1a1',
                paddingBottom: '150px'
            }}>
                <p className="text-dark mb-4 text-center" style={{ fontSize: '20px', fontWeight: 'bold' }}> 
                    Toolbox 
                </p>

                <div style={{ 
                        height: '100px', 
                        borderTop: '1px solid #a1a1a1', 
                        borderBottom: '1px solid #a1a1a1'
                    }}>
                    <p className="text-center" style={{ marginTop: '12%', fontSize: '22px' }}>
                        Role
                    </p>
                </div>

                <div style={{ 
                    height: '100px', 
                    borderTop: '1px solid #e1e1e1', 
                    borderBottom: '1px solid #a1a1a1'
                }}>
                    <p className="text-center" style={{ marginTop: '12%', fontSize: '22px' }}>
                        Goal
                    </p>
                </div>

                <div style={{ 
                    height: '100px', 
                    borderTop: '1px solid #e1e1e1', 
                    borderBottom: '1px solid #a1a1a1'
                }}>
                    <p className="text-center" style={{ marginTop: '12%', fontSize: '22px' }}>
                        Task
                    </p>
                </div>

                <div style={{ 
                    height: '100px', 
                    borderTop: '1px solid #e1e1e1', 
                    borderBottom: '1px solid #a1a1a1'
                }}>
                    <p className="text-center" style={{ marginTop: '12%', fontSize: '22px' }}>
                        Relationships
                    </p>
                </div>
                <div>
                    <ImportDataModal setUploadedObject={this.props.setUploadedObject} /> 
                </div>
            </div>
        );
    }
}

export default SideBar;