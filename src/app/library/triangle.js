import Template from "./template";
import paper from "paper";

export default class Triangle extends Template{
    constructor(){
        super();
    }
    
    __setupDefinitions(){
        this.__unique = {
            "position": "Point",
        };
        this.__heritable = {
            "length": "Float",
            "width": "Float",
            "height": "Float",
        };
        this.__units = {
            "length": "&mu;m",
            "width": "&mu;m",
            "height": "&mu;m",

        };
        this.__defaults = {
            "width": 600,
            "length": 300,
            "height": .1 * 1000,

        };
        this.__minimum = {
            "width": 30,
            "length": 120,
            "height": 10,

        };
        this.__maximum = {
            "width": 6000,
            "length": 24 * 1000,
            "height": 1200,
        };

        this.__placementTool = "componentPositionTool";

        this.__toolParams = {
            position: "position"
        }
        this.__featureParams = {
            position: "position",
            width: "width",
            length: "length",
            height: "height"
        };
        this.__targetParams = {
            width: "width",
            length: "length",
            height: "height"
        }

        this.__renderKeys = ["FLOW"];

        this.__mint = "TRIANGLE";


    }

    render2D(params, key){
        console.log("krishna test:",params);
        let position = params["position"];
        let radius = params["width"] / Math.sqrt(3)
        let color1 = params["color"];
        let pos = new paper.Point(position[0], position[1]);
        let outerCircle = new paper.Path.RegularPolygon(pos,3, radius);
        outerCircle.fillColor = color1;
        return outerCircle;

    }

    render2DTarget(key, params){
        let render = this.render2D(params, key);
        render.fillColor.alpha = 0.5;
        return render;

    }
}