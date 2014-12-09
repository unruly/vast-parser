define(['util/window'], function(window) {
    var Node = Node || {},
        XML_NODE_TYPE = {
            ELEMENT: Node.ELEMENT_NODE || 1,
            TEXT: Node.TEXT_NODE || 3,
            CDATA: Node.CDATA_SECTION_NODE || 4
        };

    function parseText(value) {
        if (/^\s*$/.test(value)) {
            return null;
        }

        if (/^(?:true|false)$/i.test(value)) {
            return value.toLowerCase() === 'true';
        }

        if (isFinite(value)) {
            return parseFloat(value);
        }

        if (isFinite(Date.parse(value))) {
            return new Date(value);
        }

        return value;
    }

    function isTextNodeOrCDATANode(node) {
        return node.nodeType === XML_NODE_TYPE.TEXT ||
               node.nodeType === XML_NODE_TYPE.CDATA;
    }

    function isElementNodeWithoutPrefix(node) {
        return node.nodeType === XML_NODE_TYPE.ELEMENT && !node.prefix;
    }

    function JSXMLNode(node) {
        if (node.hasChildNodes()) {
            var text = '',
                childNode, 
                childNodeName, 
                jsXMLNode,
                index;
            
            for (index = 0; index < node.childNodes.length; index++) {
                childNode = node.childNodes.item(index);
                
                if (isTextNodeOrCDATANode(childNode)) {
                    text += childNode.nodeValue.trim();
                } else if (isElementNodeWithoutPrefix(childNode)) {
                    childNodeName = childNode.nodeName;
                    
                    jsXMLNode = new JSXMLNode(childNode);
                    if (this.hasOwnProperty(childNodeName)) {
                        if (this[childNodeName].constructor !== Array) {
                            this[childNodeName] = [this[childNodeName]];
                        }
                        
                        this[childNodeName].push(jsXMLNode);
                    } else {
                        this[childNodeName] = jsXMLNode;
                    }
                }
            }
            
            if (text) {
                this.nodeValue = parseText(text.trim());
            }
        }
        
        if (node.hasAttributes && node.hasAttributes()) {
            var attribute,
                attributeIndex;
            
            for (attributeIndex = 0; attributeIndex < node.attributes.length; attributeIndex++) {
                attribute = node.attributes.item(attributeIndex);
                
                this['@' + attribute.name] = parseText(attribute.value.trim());
            }
        }
    }

    return {
        parse : function(doc) {
            return new JSXMLNode(doc);
        }
    };
});
