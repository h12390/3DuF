import Template from "./template";
import paper from "paper";

export  default class GradientGenerator extends Template{
    constructor(){
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            "position": "Point"
        };

        this.__heritable = {
            "bendSpacing": "Float",
            "numberOfBends": "Float",
            "channelWidth": "Float",
            "bendLength": "Float",
            "in": "Float",
            "out": "Float",
            "spacing": "Float",
            "height": "Float",
            "rotation": "Float"
        };

        this.__defaults = {
            "channelWidth": .80 * 1000,
            "bendSpacing": 1.23 * 1000,
            "numberOfBends": 1,
            "orientation": "V",
            "bendLength": 2.46 * 1000,
            "in": 1,
            "out": 3,
            "spacing": 10000,
            "height": 250,
            "rotation": 0
        };


        this.__units = {
            "bendSpacing": "&mu;m",
            "numberOfBends": "",
            "channelWidth": "&mu;m",
            "bendLength": "&mu;m",
            "orientation": "",
            "in": "",
            "out": "",
            "spacing": "&mu;m",
            "height": "&mu;m",
            "rotation" : "&deg;"
        };

        this.__minimum = {
            "channelWidth": 10,
            "bendSpacing": 10,
            "numberOfBends": 1,
            "orientation": "H",
            "bendLength": 10,
            "in": 1,
            "out": 3,
            "spacing": 10,
            "height": 10,
            "rotation": 0
        };

        this.__maximum = {
            "channelWidth": 2000,
            "bendSpacing": 6000,
            "numberOfBends": 20,
            "orientation": "H",
            "bendLength": 12 * 1000,
            "in": 30,
            "out": 90,
            "spacing": 90000,
            "height": 1200,
            "rotation":360
        };

        this.__featureParams = {
            position: "position",
            channelWidth: "channelWidth",
            bendSpacing: "bendSpacing",
            numberOfBends: "numberOfBends",
            orientation: "orientation",
            bendLength: "bendLength",
            in: "in",
            out: "out",
            spacing: "spacing",
            rotation: "rotation"

        };

        this.__targetParams = {
            channelWidth: "channelWidth",
            bendSpacing: "bendSpacing",
            numberOfBends: "numberOfBends",
            orientation: "orientation",
            bendLength: "bendLength",
            in: "in",
            out: "out",
            spacing: "spacing",
            rotation: "rotation"

        };

        this.__placementTool = "componentPositionTool";

        this.__toolParams = {
            position: "position"
        };

        this.__renderKeys = ["FLOW"];

        this.__mint = "GRADIENT GENERATOR";

    }

    render2D(params, key) {
        let position = params["position"];
        let bendSpacing = params["bendSpacing"];
        let numBends = params["numberOfBends"];
        let channelWidth = params["channelWidth"];
        let bendLength = params["bendLength"];
        let orientation = params["orientation"];
        let invalue = params["in"];
        let outvalue = params["out"];
        let spacing = params["spacing"]; //Center to Center
        let rotation = params["rotation"];
        let color = params["color"];

        let posx = position[0];
        let posy = position[1];
        let stagelength = channelWidth * (2 * numBends + 1) + (2 * numBends + 2) * bendSpacing + channelWidth;
        let gradientgenerator = new paper.CompoundPath();
        // insertMixer(gradientgenerator, bendSpacing, numBends, channelWidth, bendLength, posx, posy, color);
        //Iterate through each of the stages

        //Draw the first stage which is just channels
        let totalstagewidth = (invalue - 1) * spacing;
        let xref = (posx - totalstagewidth / 2);
        ;
        let yref = posy;
        //Draw straight channels for each of the input lines
        for (let i = 0; i < invalue; i++) {
            let x = xref + spacing * i;
            let y = yref;

            //Insert Straight channel
            gradientgenerator.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x, y),
                size: [channelWidth, stagelength + channelWidth]
            }));
        }

        for (let stagevalue = invalue + 1; stagevalue <= outvalue; stagevalue++) {
            //For each stage : do the following
            /*
            Check if each stagevalue is odd or even

            if (not last stage) place horizontal bar connecting eveything
             */

            //Calculate the total width and start placing mixers
            let totalstagewidth = (stagevalue - 1) * spacing;

            xref = (posx - totalstagewidth / 2);
            yref = posy + stagelength * (stagevalue - invalue);

            //Start from the left
            for (let i = 0; i < stagevalue; i++) {
                let x = xref + spacing * i;

                let y = yref;
                //insert the mixer
                this.__insertMixer(gradientgenerator, bendSpacing, numBends, channelWidth, bendLength, x, y, color);

            }

            // Insert horizontal bar
            let hbar = new paper.Path.Rectangle({
                point: new paper.Point(xref, yref),
                size: [totalstagewidth, channelWidth],
                fillColor: color,
                strokeWidth: 0
            });

            gradientgenerator.addChild(hbar);
        }

        gradientgenerator.fillColor = color;
        // console.log("testing");

        gradientgenerator.rotate(-rotation, new paper.Point(posx, posy));

        return gradientgenerator;

    }


    __insertMixer(serpentine, bendSpacing, numBends, channelWidth, bendLength, x, y, color){
        let segHalf = bendLength/2 + channelWidth;
        let segLength = bendLength + 2*channelWidth;
        let segBend = bendSpacing + 2*channelWidth;
        let vRepeat = 2*bendSpacing + 2*channelWidth;
        let vOffset = bendSpacing + channelWidth;
        let hOffset = bendLength/2 + channelWidth/2;

        x -= hOffset;
        //TopRectangle
        serpentine.addChild(new paper.Path.Rectangle(x+hOffset, y, channelWidth, 2*channelWidth+ bendSpacing));
        y += channelWidth +bendSpacing;
        serpentine.addChild(new paper.Path.Rectangle(x, y, segHalf + channelWidth/2, channelWidth));
        for(let i = 0; i < numBends; i++){
            serpentine.addChild(new paper.Path.Rectangle(x, y+vRepeat*i, channelWidth, segBend));
            serpentine.addChild(new paper.Path.Rectangle(x, y+vOffset+vRepeat*i, segLength, channelWidth));
            serpentine.addChild(new paper.Path.Rectangle(x+channelWidth+ bendLength, y+vOffset+vRepeat*i, channelWidth, segBend));
            if (i == numBends-1){//draw half segment to close
                serpentine.addChild(new paper.Path.Rectangle(x+hOffset, y+vRepeat*(i+1), segHalf, channelWidth));
            } else{//draw full segment
                serpentine.addChild(new paper.Path.Rectangle(x, y+vRepeat*(i+1), segLength, channelWidth));
            }
        }

        //Bottom rectabvke
        serpentine.addChild(new paper.Path.Rectangle(x+hOffset, y+vRepeat*(numBends), channelWidth, 2*channelWidth+ bendSpacing));


        return serpentine;
    };


    render2DTarget(key, params){
        let render = this.render2D(params, key);
        render.fillColor.alpha = 0.5;
        return render
    }
}