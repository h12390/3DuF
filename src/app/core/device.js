var Params = require("./params");
var Parameters = require("./parameters");
var Parameter =require("./parameter");
var Feature = require('./feature')
var Layer = require('./layer');
var Group = require('./group');
var Registry = require("./registry");

var StringValue = Parameters.StringValue;
var FloatValue = Parameters.FloatValue;

/* The Device stores information about a design. */
class Device {
    constructor(values, name = "New Device") {
        this.defaults = {};
        this.layers = [];
        this.groups = [];
        this.params = new Params(values, Device.getUniqueParameters(), Device.getHeritableParameters());
        this.name = new StringValue(name);
    }

    setName(name){
        this.name = new StringValue(name);
        this.updateView();
    }

    updateParameter(key, value){
        this.params.updateParameter(key, value);
        this.updateView();
    }

    /* Sort the layers such that they are ordered from lowest to highest z_offset. */
    sortLayers() {
        this.layers.sort(function(a, b) {
            return a.params.getValue("z_offset") - b.params.getValue("z_offset");
        });
    }

    getLayerFromFeatureID(featureID){
        for (let i = 0; i < this.layers.length; i ++){
            let layer = this.layers[i];
            if (layer.containsFeatureID(featureID)){
                return layer;
            } 
        } 
        throw new Error("FeatureID " + featureID + " not found in any layer.");
    }

    getFeatureByID(featureID){
        let layer =  this.getLayerFromFeatureID(featureID);
        return layer.getFeature(featureID);
    }

    /* Add a layer, and re-sort the layers array.*/
    addLayer(layer) {
        this.layers.push(layer);
        this.sortLayers();
        layer.device = this;
    }
    
    removeFeature(feature){
        this.removeFeatureByID(feature.id);
    }

    removeFeatureByID(featureID){
        let layer = this.getLayerFromFeatureID(featureID);
        layer.removeFeatureByID(featureID);
    }

    addGroup(group) {
        this.groups.push(group);
        //TODO: Check to make sure that's OK!
    }

    addDefault(def) {
        this.defaults.push(def);
        //TODO: Establish what defaults are. Params?
    }

    updateView(){
        if (Registry.viewManager) Registry.viewManager.updateDevice(this);
    }

    static getUniqueParameters(){
        return {
            "height": FloatValue.typeString(),
            "width": FloatValue.typeString()
        }
    }

    //TODO: Figure out whether this is ever needed
    static getHeritableParameters(){
        return {};
    }

    __renderLayers2D(){
        let output = [];
        for (let i = 0; i < this.layers.length; i++){
            output.push(this.layers[i].render2D())
        }
        return output;
    }

    __groupsToJSON() {
        let output = [];
        for (let i in this.groups) {
            output.push(this.groups[i].toJSON());
        }
        return output;
    }

    __layersToJSON() {
        let output = [];
        for (let i in this.layers) {
            output.push(this.layers[i].toJSON());
        }
        return output;
    }

    __loadLayersFromJSON(json) {
        for (let i in json) {
            this.addLayer(Layer.fromJSON(json[i]));
        }
    }

    //TODO: Figure this out!
    __loadGroupsFromJSON(json) {
        /*
        for (let i in json){
            this.addGroup(Group.fromJSON(json[i]));
        }
        */
    }

    //TODO: Figure this out!
    __loadDefaultsFromJSON(json) {
        /*
        for(let i in json){
            this.addDefault(json[i]);
        }
        */
    }

    //TODO: Replace Params and remove static method
    toJSON() {
        let output = {};
        output.name = this.name.toJSON();
        output.params = this.params.toJSON();
        output.layers = this.__layersToJSON();
        output.groups = this.__groupsToJSON();
        output.defaults = this.defaults;
        return output;
    }

    static fromJSON(json) {
        let defaults = json.defaults;
        let newDevice = new Device({
            "width": json.params.width,
            "height": json.params.height
        }, json.name);
        newDevice.__loadLayersFromJSON(json.layers);
        newDevice.__loadGroupsFromJSON(json.groups);
        newDevice.__loadDefaultsFromJSON(json.defaults);
        return newDevice;
    }

    render2D(paperScope){
        return this.__renderLayers2D();
    }
}

module.exports = Device;