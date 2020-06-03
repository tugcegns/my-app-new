import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./components/NavigationBar";
import SideBar from "./components/SideBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "react-bootstrap";
import Playground from './components/Playground';


class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            uploadedObject: {},
            jsonExportClicked: false
        }
    }
    setUploadedObject = uploadedObject => {
        this.setState({ uploadedObject });
    }

    handleJSONExport = () => {
        this.setState({ jsonExportClicked: true })
    }
    download = (filename, text) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }
    exportJSON = graphObject => {
        this.download("goal-model.json", JSON.stringify(graphObject));
    }

    render (){
        const { uploadedObject, jsonExportClicked } = this.state;
        return(
            <div>
                <NavigationBar handleJSONExport={this.handleJSONExport}/>
                <Row>
                    <Col md="2" style={{ overflow: 'auto' }}>
                        <SideBar setUploadedObject={this.setUploadedObject} />
                    </Col>
                    <Col md="10" className="pt-3" style={{overflow:'auto'}} >
                        <Playground uploadedObject={uploadedObject} 
                                    jsonExportClicked={jsonExportClicked} 
                                    exportJSON={this.exportJSON}/>
                    </Col>
                </Row>
                
            </div>
        );
    }
}

export default MainPage;