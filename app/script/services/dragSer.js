/**
 * 
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(function(){
	var hoverNode;
return {
	
    setDragStatus : function(flag){
        this.isDrag = !!flag;
    },
    setHoverNode : function(node){
        hoverNode = node;
    },
    getHoverNode : function(){
        return hoverNode;
    },
    removeHoverNode : function(){
        hoverNode = null;
    }
}

});


