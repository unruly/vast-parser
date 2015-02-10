define(['./util/window'], function(window) {
    var Node = Node || {},
        XML_NODE_TYPE = {
            ELEMENT: Node.ELEMENT_NODE || 1,
            TEXT: Node.TEXT_NODE || 3,
            CDATA: Node.CDATA_SECTION_NODE || 4
        };

    function isTextNodeOrCDATANode(node) {
        return node.nodeType === XML_NODE_TYPE.TEXT ||
               node.nodeType === XML_NODE_TYPE.CDATA;
    }

    function isElementNodeWithoutPrefix(node) {
        return node.nodeType === XML_NODE_TYPE.ELEMENT && !node.prefix;
    }

    function JSXMLNode(node) {
        if ("undefined" === typeof node) {
            return this;
        }

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
                this.nodeValue = text.trim();
            }
        }
        
        if (node.hasAttributes && node.hasAttributes()) {
            var attribute,
                attributeIndex;
            
            for (attributeIndex = 0; attributeIndex < node.attributes.length; attributeIndex++) {
                attribute = node.attributes.item(attributeIndex);
                
                this['@' + attribute.name] = attribute.value.trim();
            }
        }
    }

    return {
        parse : function(doc) {
            var parser;

            if (!!doc.xml) {
                parser = new window.DOMParser();
                doc = parser.parseFromString(doc.xml, "text/xml");
            }

            return new JSXMLNode(doc);
        }
    };
});
