import React from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { dia, shapes } from 'jointjs';
import { each } from 'underscore';

class Playground extends React.Component{

    constructor(props) {
        super(props);
        this.graph = new dia.Graph({ /* attributes of the graph */ }, { cellNamespace: shapes }); //önce boş bir graph oluşturuyoruz.
        this.state = {
            maxSize: 0
        }
    }
    componentDidMount(){
        this.paper = new dia.Paper({ // Paper oluşturuyoruz çalışma sheeti gibi 
            el: ReactDOM.findDOMNode(this.refs.playground), //html' e koyarken hangi elemente atadığımızı belirtiyoruz.
            cellViewNamespace: shapes,
            width: 2500,
            height: 2500,
            model: this.graph // yukarda oluşturduğumuz graphı buna atıyoruz.
        });
        this.offsetX = 150;
        this.offsetY = 150;
        this.maxSize = 0;
    }
    createRole = (label, goalCount) => {
        var CustomElement = dia.Element.define('examples.CustomElement', {
            attrs: {
                c:{
                    strokeWidth :  1,
                    stroke: '#111111',
                    fill:  '#cffdd4'
                    
                },
                e: {
                    strokeWidth :  1,
                    stroke: '#111111',
                    fill:  'rgba(222,222,222,0.7)',
                    fillOpacity : 0.5,
                    strokeDasharray: 5,
                    strokeDashoffset: 2.5
                },
                label:{
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    refX: '50%',
                    refY: '50%',
                    fontSize: 14,
                    fill: '#333333'
                }
                
            } 
        }, {
            markup: [{
                tagName: 'ellipse',
                selector: 'e'
            },{
                tagName: 'circle',
                selector: 'c'
            },{
                tagName: 'text',
                selector: 'label'
            }]
        });
        
        var role = new CustomElement();
        role.attr({
            e: {
                refRx: '65%',
                refRy: '60%',
                refCx: '25%',
                refCy: '-25%',
                refX: '25%',
                refY: '75%',
            },
            c:{
                ref:'e',
                refCx: '3%',
                refCy: '10%',
                refRCircumscribed: '9%'
                
            },
            label: {
                text: label.replace(/ /g, "\n"),
                ref: 'c'
            }
        });
        const size = (goalCount-1) * 35 + 350;

        
        if(size > this.maxSize) {
            this.maxSize = size;
            console.log(size);
            console.log(this.maxSize);
        }
        
        role.resize(size,size);
        if(this.offsetX >= 2000){
            this.offsetX = 100;
            this.offsetY += (this.maxSize * 1.4);
            this.maxSize = 0;
        }
        role.position(this.offsetX, this.offsetY);
        this.offsetX += (size * 1.4);
        role.addTo(this.graph);
        return role;
        /*
        

        /*
        var r1 = new shapes.standard.Ellipse();
        r1.resize(450, 350);
        r1.position(20, 20);
        r1.attr({
                root: {
                    tabindex :  3,
                    title: 'joint.shapes.standard.Ellipse'},
                body: {
                    fill:  'rgba(222,222,222,0.7)', 
                    fillOpacity : 0.5,
                    strokeWidth :  1,
                    stroke: '#111111',
                    strokeDasharray: 5,
                    strokeDashoffset: 2.5},
                label: {
                    text: label}
        });
        return r1;
        */
    }
    createGoal = (label, x, y) => {
        var rect = new shapes.standard.Rectangle();
        rect.position(x+100, y+100);
        rect.resize(label.length * 7.5, 80);
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
    createLink = (sourceID, targetID, label, x, y)=> {
        
        var link = new shapes.standard.Link();
        
        link.prop('source', { id: sourceID });
        link.prop('target', {id: targetID });
        link.prop('vertices', [{x: x+100,y: y+100}])
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
            let nodes = uploadedObject[key];

            const role = this.createRole(key, nodes.length);
            //graphElements.push(role);
            
            for (var i in nodes){
                let node = nodes[i];
                if(node.type == 'goal') {
                    var goal = this.createGoal(node.label, role.get('position').x, role.get('position').y);
                    role.embed(goal);
                } // else createTask
                let children = node.children[0];
                if(children.type == 'goal'){
                    for(var i in children.label){
                        var subgoal = this.createGoal(children.label[i], role.get('position').x, role.get('position').y);
                        var link = this.createLink(goal.id, subgoal.id, children.relationship, role.get('position').x, role.get('position').y);
                        role.embed(subgoal);
                        role.embed(link);
                        graphElements.push([subgoal,link])
                    }
                }
                graphElements.push(goal);
            }
            this.graph.addCells(graphElements);
            
            this.graph.on('change:size', (cell, newPosition, opt) => {

                if (opt.skipParentHandler) return;
        
                if (cell.get('embeds') && cell.get('embeds').length) {
                    cell.set('originalSize', cell.get('size'));
                }
            });

            this.graph.on('change:position', (cell, newPosition, opt) => {

                if (opt.skipParentHandler) return;
        
                if (cell.get('embeds') && cell.get('embeds').length) {
                    // If we're manipulating a parent element, let's store
                    // it's original position to a special property so that
                    // we can shrink the parent element back while manipulating
                    // its children.
                    cell.set('originalPosition', cell.get('position'));
                }
        
                var parentId = cell.get('parent');
                if (!parentId) return;
        
                var parent = this.graph.getCell(parentId);
        
                if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
                if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
        
                var originalPosition = parent.get('originalPosition');
                var originalSize = parent.get('originalSize');
        
                var newX = originalPosition.x;
                var newY = originalPosition.y;
                var newCornerX = originalPosition.x + originalSize.width;
                var newCornerY = originalPosition.y + originalSize.height;
        
                each(parent.getEmbeddedCells(), function(child) {
        
                    var childBbox = child.getBBox();
        
                    if (childBbox.x < newX) { newX = childBbox.x; }
                    if (childBbox.y < newY) { newY = childBbox.y; }
                    if (childBbox.corner().x > newCornerX) { newCornerX = childBbox.corner().x; }
                    if (childBbox.corner().y > newCornerY) { newCornerY = childBbox.corner().y; }
                });
        
                // Note that we also pass a flag so that we know we shouldn't adjust the
                // `originalPosition` and `originalSize` in our handlers as a reaction
                // on the following `set()` call.
                parent.set({
                    position: { x: newX, y: newY },
                    size: { width: newCornerX - newX, height: newCornerY - newY }
                }, { skipParentHandler: true });
            });

            
        }
    }

    componentWillReceiveProps = newProps => {
        const { uploadedObject, jsonExportClicked, exportJSON } = newProps;
        if(jsonExportClicked) exportJSON(this.graph.toJSON());
        if(uploadedObject.cells) this.graph.fromJSON(uploadedObject);
        else this.createGraph(uploadedObject);
    }


    render(){
        return(
            <div ref="playground" id="playground" onClick={e => {console.log(e.clientX)}}>
            </div>
        );
    }

}
export default Playground;