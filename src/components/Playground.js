import React from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { dia, shapes } from 'jointjs';

class Playground extends React.Component{

    constructor(props) {
        super(props);
        this.graph = new dia.Graph({ /* attributes of the graph */ }, { cellNamespace: shapes }); //önce boş bir graph oluşturuyoruz.
 
    }
    componentDidMount(){
        this.paper = new dia.Paper({ // Paper oluşturuyoruz çalışma sheeti gibi 
            el: ReactDOM.findDOMNode(this.refs.playground), //html' e koyarken hangi elemente atadığımızı belirtiyoruz.
            cellViewNamespace: shapes,
            width: 1500,
            height: 700,
            model: this.graph // yukarda oluşturduğumuz graphı buna atıyoruz.
        });

    }

    componentWillReceiveProps(newProps) {
        const { uploadedObject, jsonExportClicked, exportJSON } = newProps;
        if(jsonExportClicked) exportJSON(this.graph.toJSON());
        if(uploadedObject.cells) this.graph.fromJSON(uploadedObject);
    }


    render(){
        return(
            <div ref="playground" id="playground">
            </div>
        );
    }

}
export default Playground;