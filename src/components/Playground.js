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
        r1.resize(450, 350);
        r1.position(20, 20);
        r1.attr('root/tabindex', 3);
        r1.attr('root/title', 'joint.shapes.standard.Ellipse');
        r1.attr('body/fill', 'rgba(222,222,222,0.7)');
        r1.attr('body/fillOpacity', 0.5);
        r1.attr('body/strokeWidth', 1);
        r1.attr('body/stroke', '#111111');
        r1.attr('body/strokeDasharray', 5);
        r1.attr('body/strokeDashoffset', 2.5);
        r1.attr('label/text', label);
        return r1;
    }
    createGoal = label => {
        var rect = new shapes.standard.Rectangle();
        rect.position(100, 250);
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
            graphElements.push(role);
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