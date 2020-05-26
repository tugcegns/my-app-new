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
    createRole = label => {
        var r1 = new shapes.standard.Ellipse();
        r1.resize(250, 150);
        r1.position(20, 20);
        r1.attr('root/tabindex', 3);
        r1.attr('root/title', 'joint.shapes.standard.Ellipse');
        r1.attr('body/fill', 'rgba(222,222,222,0.7)');
        r1.attr('body/fillOpacity', 0.5);
        r1.attr('strokeDasharray', 5 );
        r1.attr('label/text', label);
        return r1;
    }
    createGoal = label => {
        var rect = new shapes.standard.Rectangle();
        rect.position(100, 250);
        rect.resize(150, 80);
        rect.attr({
            body: {
                fill: '#cffdd4',
                rx: 40,
                ry: 40,
                strokeWidth: 2
            },
            label: {
                text: label ,
                fill: 'blue'
            }
        });
        return rect;
    }
    createLink = (sourceID, targetID, label)=> {
        
        var link = new shapes.standard.Link();
        
        link.prop('source', { id: sourceID });
        link.prop('target', {id: targetID });
        link.prop('vertices', [{x: 250 ,
                                y: 200 }])
        link.attr('root/title', 'joint.shapes.standard.Link');
        link.attr('line/stroke', '#31a2e7');
        link.labels([{
            attrs: {
                text: {
                    text: label
                }
            }
        }]);
        return link;
    }

    createGraph = uploadedObject => {
        for(var key in uploadedObject){
            var graphElements = [];
            const role = this.createRole(key);
            let nodes = uploadedObject[key];
            for (var i in nodes){
                let node = nodes[i];
                if(node.type == 'goal') {
                    var goal = this.createGoal(node.label);
                    role.embed(goal);
                } // else createTask
                let children = node.children[0];
                if(children.type == 'goal'){
                    for(var i in children.label){
                        var subgoal = this.createGoal(children.label[i]);
                        var link = this.createLink(goal.id, subgoal.id, children.relationship);
                        role.embed(subgoal);
                        role.embed(link);
                        graphElements.push([subgoal,link])
                    }
                }
                graphElements.push(goal);
            }
            graphElements.push(role);
            this.graph.addCells(graphElements);
            
        }
    }

    componentWillReceiveProps(newProps) {
        const { uploadedObject, jsonExportClicked, exportJSON } = newProps;
        if(jsonExportClicked) exportJSON(this.graph.toJSON());
        if(uploadedObject.cells) this.graph.fromJSON(uploadedObject);
        else this.createGraph(uploadedObject);
    }


    render(){
        return(
            <div ref="playground" id="playground">
            </div>
        );
    }

}
export default Playground;