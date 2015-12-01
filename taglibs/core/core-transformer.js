'use strict';

var extend = require('raptor-util/extend');
var parseComplexAttribute = require('./util/parseComplexAttribute');
var parseForEach = require('./util/parseForEach');

var coreAttrHandlers = [
    [
        'for', function(attr, node) {
            var forArgument = attr.argument;
            if (!forArgument) {
                return;
            }

            var forEachProps = parseComplexAttribute(forArgument, {
                    each: true,
                    separator: true,
                    'iterator': true,
                    'status-var': true,
                    'for-loop': true
                },
                {
                    removeDashes: true,
                    defaultName: 'each',
                    errorHandler: function (message) {
                        this.addError('Invalid for attribute of "' + attr + '". Error: ' + message);
                    }
                });

            if (!forEachProps.each) {
                this.addError('Invalid "for" attribute.');
            }

            var parsedForEach = parseForEach(forEachProps.each);
            delete forEachProps.each;
            extend(forEachProps, parsedForEach);

            forEachProps.pos = node.pos;
            //Copy the position property
            var forEachNode = this.compiler.builder.forEach(forEachProps);
            //Surround the existing node with a "forEach" node
            node.wrap(forEachNode);
        }
    ],
    [
        'if', function(attr, node) {
            var ifArgument = attr.argument;
            if (!ifArgument) {
                return;
            }
            var ifNode = this.builder.ifStatement(ifArgument);
            //Surround the existing node with an "if" node
            node.wrap(ifNode);
        }
    ],
    [
        'unless', function(attr, node) {
            var ifArgument = attr.argument;
            if (!ifArgument) {
                return;
            }
            var ifNode = this.builder.ifStatement(ifArgument);
            //Surround the existing node with an "if" node
            node.wrap(ifNode);
        }
    ],
    [
        'else-if', function(attr, node) {
            var elseIfArgument = attr.argument;
            if (!elseIfArgument) {
                return;
            }
            var elseIfNode = this.builder.elseIfStatement(elseIfArgument);
            //Surround the existing node with an "if" node
            node.wrap(elseIfNode);
        }
    ],
    [
        'else', function(attr, node) {
            var elseNode = this.compiler.builder.elseStatement();
            //Surround the existing node with an "if" node
            node.wrap(elseNode);
        }
    ],
    [
        'body-only-if', function(attr, node, el) {
            var condition = attr.argument;
            if (!condition) {
                this.addError('Invalid "body-only-if" attribute');
                return;
            }

            if (el.nodeType !== '')

            el.setStripExpression(attr);
        }
    ]
];

class AttributeTransformer {
    constructor(compiler, el) {
        this.compiler = compiler;
        this.builder = compiler.builder;
        this.el = el;
    }

    transformNode(el) {
        var node = el;
        for (var i=0, len=coreAttrHandlers.length; i<len; i++) {
            var attrHandler = coreAttrHandlers[i];
            var name = attrHandler[0];
            var attr = node.getAttribute(name);
            if (attr != null) {
                node.removeAttribute(name);
                var newNode = this[name](attr, node, el);
                if (newNode) {
                    newNode.pos = node.pos;
                    node = newNode;
                }
            }
        }

        return node;
    }

    addError(error) {
        this.compiler.addError(this.el, error);
    }
}

coreAttrHandlers.forEach(function(attrHandler) {
    var name = attrHandler[0];
    var func = attrHandler[1];
    AttributeTransformer.prototype[name] = func;
});

var attributeTransformers = AttributeTransformer.prototype;

module.exports = function transform(el, compiler) {
    var attributeTransfomer;

    var attributes = el.getAttributes();
    if (attributes) {
        for (let i=0, len=attributes.length; i<len; i++) {
            let attr = attributes[i];
            let attrName = attr.name;
            var attrTransformerFunc = attributeTransformers[attrName];
            if (attrTransformerFunc) {
                el.removeAttribute(attrName);

                if (!attributeTransfomer) {
                    attributeTransfomer = new AttributeTransformer(compiler, el);
                }
                attributeTransfomer[attrName](attr, el);
            }
        }
    }
};