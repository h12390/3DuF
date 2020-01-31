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
        this.__toolParams = {
            position: "position"
        }
        this.__featureParams = {
            position: "position",
            portRadius: "portRadius"
        };
        this.__targetParams = {
            position: "position",
            portRadius: "portRadius"
        }

    }

    render2D(params, key){

    }

    render2DTarget(key, params){

    }
}