import React from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { dia, shapes } from 'jointjs';
import { each } from 'underscore';
import LabelModal from '../components/LabelModal';

class Playground extends React.Component{

    constructor(props) {
        super(props);
        this.graph = new dia.Graph({ /* attributes of the graph */ }, { cellNamespace: shapes }); //önce boş bir graph oluşturuyoruz.
        this.state = {
            maxSize: 0,
            showLabelModal: false,
            source: null
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
        this.paper.on('element:pointerclick', (elementView, eventObject, eventX, eventY) => {
        
            const { selectedTool } = this.props;

            var currentElement = elementView.model;
            console.log(this.graph);

            if(selectedTool == "goal" && currentElement.get('type') == 'node.role'){
                const goal = this.createGoal("Goal", eventX - 50, eventY - 25);
                currentElement.embed(goal);
                this.graph.addCell(goal);
                this.props.handleToolClick(null);
            }else if((selectedTool === 'and' || selectedTool === 'or') && currentElement.get('type') === 'standard.Rectangle'){
                var { source } = this.state;
                if(source){
                    if(currentElement.get('id') === source.get('id')) return;

                    const x = (source.get('position').x + currentElement.get('position').x) / 2;
                    const y = (source.get('position').y + currentElement.get('position').y) / 2 - 50;
                    const link = this.createLink(source.get('id'), currentElement.get('id'), selectedTool, x, y);
                    this.graph.addCell(link);
                    this.props.handleToolClick(null);
                }else{
                    this.setState({source: currentElement});
                }
            }else{
                this.setState({source: null});
            }
            
        });
        this.paper.on('element:pointerdblclick', elementView => {
            const currentElement = elementView.model;
            const label = currentElement.attr('label').text;
            this.setState({ showLabelModal:true, label, selectedElement: currentElement });
        });

        this.paper.on('link:pointerdblclick', linkView => {
            const link = linkView.model;
            const label = link.get('labels')[0].attrs.text.text;
            this.setState({ showLabelModal:true, label, selectedElement: link });
        });

        this.paper.on('blank:pointerclick', (eventObject, eventX, eventY) => {

            if(this.props.selectedTool !== "role") return;

            this.createRole("Role", 0, {x: eventX, y: eventY});

            this.props.handleToolClick(null);
            
        });

        this.offsetX = 150;
        this.offsetY = 150;
        this.maxSize = 0;

        this.CustomElement = dia.Element.define('node.role', {
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
        shapes.node = {};
        shapes.node.role = this.CustomElement;
    }
    createRole = (label, goalCount, coordinates) => {
        
        var role = new this.CustomElement();
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
        }
        
        role.resize(size,size);
        if(this.offsetX >= 2000){
            this.offsetX = 100;
            this.offsetY += (this.maxSize * 1.4);
            this.maxSize = 0;
        }
        if(coordinates) role.position(coordinates.x, coordinates.y);
        else role.position(this.offsetX, this.offsetY);
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
        const width = label.length < 16 ? 120 : label.length * 7.5;
        rect.position(x, y);
        rect.resize(width, 80);
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
                    var goal = this.createGoal(node.label, role.get('position').x + 100, role.get('position').y + 100);
                    role.embed(goal);
                } // else createTask
                if( !node.children || node.children.length === 0 )continue;
                let children = node.children[0];
                if(children.type == 'goal'){
                    for(var i in children.label){
                        var subgoal = this.createGoal(children.label[i], role.get('position').x + 100, role.get('position').y + 100);
                        var link = this.createLink(goal.id, subgoal.id, children.relationship, role.get('position').x, role.get('position').y);
                        role.embed(subgoal);
                        role.embed(link);
                        graphElements.push([subgoal,link])
                    }
                }
                graphElements.push(goal);
            }
            this.graph.addCells(graphElements);
        

            
        }
    }

    handleToolAdd = e => {
        const x = e.clientX - 350;
        const y = e.clientY - 200;
        switch (this.props.selectedTool){
            case "role": 
                this.createRole("Role", 0, {x,y});
                break;
                /*
            case "goal": 
                const goal = this.createGoal("Goal", x, y);
                this.graph.addCell(goal);
                break;
                */
            default:
                break;
        }
        this.props.handleToolClick(null);
    }

    componentWillReceiveProps = newProps => {
        const { uploadedObject, jsonExportClicked, exportJSON, handleJSONExport, setUploadedObject  } = newProps;
        if(jsonExportClicked) {
            exportJSON(this.graph.toJSON());
            handleJSONExport(false);
        }
        if(uploadedObject.cells) {
            this.graph.fromJSON(uploadedObject);
            setUploadedObject({});
        }
        else if (uploadedObject !== {}) this.createGraph(uploadedObject);
    }

    onLabelChange = newLabel => {
        const {selectedElement} = this.state;
        console.log(selectedElement.get('type'))
        if(selectedElement.get('type') === "standard.Link") {
            selectedElement.labels([{
                attrs: {
                    text: {
                        text: newLabel
                    }
                }
            }]);
        }else selectedElement.attr('label/text', newLabel);
    }

    render(){
        return(
            <div ref="playground" 
                 id="playground">
                 <LabelModal show={this.state.showLabelModal} 
                             onHide={() => {this.setState({showLabelModal:false})}}
                             label={this.state.label}
                             onLabelChange={this.onLabelChange}  />
            </div>
        );
    }

}
export default Playground;