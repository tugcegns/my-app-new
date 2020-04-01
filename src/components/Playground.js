import React from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { dia, shapes } from 'jointjs';

class Playground extends React.Component{

    constructor(props) {
        super(props);
        this.graph = new dia.Graph(); //önce boş bir graph oluşturuyoruz.
        
    }
    componentDidMount(){
        this.paper = new dia.Paper({ // Paper oluşturuyoruz çalışma sheeti gibi 
            el: ReactDOM.findDOMNode(this.refs.playground), //html' e koyarken hangi elemente atadığımızı belirtiyoruz.
            width: 1500,
            height: 700,
            model: this.graph // yukarda oluşturduğumuz graphı buna atıyoruz.
        });
        
        /*
        this.paper.on('cell:pointerdown', 
            (cellView, evt, x, y) => { 
                //alert('cell view ' + cellView.model.id + ' was clicked'); 
                
            }
        ); 
        var circle = new shapes.standard.Circle();
        circle.resize(100, 100);

        circle.position(250, 10);
        circle.attr('root/title', 'joint.shapes.standard.Circle');
        circle.attr('label/text', 'Circle');
        circle.attr('body/fill', 'lightblue');

        // console.log(circle.position())

        var circle2 = new shapes.standard.Circle();
        circle2.resize(100, 100);
        
        circle2.position(450, 10);
        circle2.attr('root/title', 'joint.shapes.standard.Circle');
        circle2.attr('label/text', 'Circle 2');
        circle2.attr('body/fill', 'lightgreen');
        */
        var rect = new shapes.standard.Rectangle();
        rect.position(100, 250);
        rect.resize(150, 80);
        rect.attr({
            body: {
                fill: '#cffdd4',
                rx: 20,
                ry: 20,
                strokeWidth: 2
            },
            label: {
                text: 'Disposal events viewed' ,
                fill: 'blue'
            }
        });

        var rect3 = new shapes.standard.Rectangle();
        rect3.position(300, 30);
        rect3.resize(150, 80);
        rect3.attr({
            body: {
                fill: '#cffdd4',
                rx: 20,
                ry: 20,
                strokeWidth: 2,
                strokeDasharray: '10,2'
            },
            label: {
                text: 'View operations conducted',
                fill: 'blue',
                fontSize: 13,
                fontVariant: 'small-caps'
            }
        });
        var rect5 = new shapes.standard.Rectangle();
        rect5.position(300, 250);
        rect5.resize(150, 80);
        rect5.attr({
            body: {
                fill: '#cffdd4',
                rx: 20,
                ry: 20,
                strokeWidth: 2
            },
            label: {
                text: 'Map display viewed',
                fill: 'blue',
                fontSize: 13
            }
        });
        var rect7 = new shapes.standard.Rectangle();
        rect7.position(500, 250);
        rect7.resize(150, 80);
        rect7.attr({
            body: {
                fill: '#cffdd4',
                rx: 20,
                ry: 20,
                strokeWidth:2
            },
            label: {
                text: 'Recycling centers viewed',
                fill: 'blue',
                fontSize: 13
            }
        });

        var link = new shapes.standard.Link();
        
        link.prop('source', { id: rect.id });
        link.prop('target', {id: rect3.id });
        link.prop('vertices', [{x: 250 ,
                                y: 200 }])
        link.attr('root/title', 'joint.shapes.standard.Link');
        link.attr('line/stroke', '#31a2e7');
        link.labels([{
            attrs: {
                text: {
                    text: 'AND'
                }
            }
        }]);
        

        var link2 = new shapes.standard.Link();
        
        link2.prop('source', { id: rect5.id });
        link2.prop('target', {id: rect3.id });
        link2.prop('vertices', [{x: 375 ,
                                y: 200 }])
        link2.attr('root/title', 'joint.shapes.standard.Link');
        link2.labels([{
            attrs: {
                text: {
                    text: 'AND'
                }
            }
        }]);
        link2.attr('line/stroke', 'blue');
        var link3 = new shapes.standard.Link();
        
        link3.prop('source', { id: rect7.id });
        link3.prop('target', {id: rect3.id });
        link3.prop('vertices', [{x: 500 ,
                                y: 200 }])
        link3.attr('root/title', 'joint.shapes.standard.Link');
        link3.attr('line/stroke', 'blue');
        link3.labels([{
            attrs: {
                text: {
                    text: 'AND'
                }
            }
        }]);
        link.attr('line/stroke', 'blue');
        this.graph.addCells([rect, rect3, rect5, rect7, link,link2,link3]); // grapha oluşturduğumuz şekilleri ekliyoruz.       
    }
    render(){
        return(
            <div ref="playground" id="playground">
            </div>
        );
    }

}
export default Playground;