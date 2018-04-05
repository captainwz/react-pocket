let babylon = require('babylon');
let traverse = require('babel-traverse').default;
let t = require('babel-types');

const func = (ast, code, objArr, srcFile) => {

    traverse(ast, {
    
        enter (p) {

            if (t.isClassDeclaration(p.node)) {
                
                if (p.node.superClass && p.node.superClass.name == '$') {

                    p.node.superClass = t.identifier('Component');

                    let className = p.node.id.name;
                    let obj = {
                        className,
                        srcFile,
                        props: Object.create(null)
                    };

                    let constructorNode;
                    
                    traverse(p.node, {
                        enter (p) {

                            if (t.isClassMethod(p)) {

                                if (p.node.key.name == 'constructor') {

                                    // delete super(props) and prepend later
                                    traverse(p.node, {
                                        enter (p) {
                                            
                                            if (t.isExpressionStatement(p.node) && 
                                                t.isCallExpression(p.node.expression) &&
                                                t.isSuper(p.node.expression.callee)) {
                                                
                                                    p.remove();
                                                    
                                            }
                                        }
                                    }, p.scope, p.parent);

                                    constructorNode = p.node;

                                    p.remove();

                                } else if (p.node.key.name == 'defaultProp') {
                                    
                                    traverse(p.node, {
                                        enter (p) {
                                            
                                            if (t.isReturnStatement(p)) {
                                                
                                                if (t.isObjectExpression(p.node.argument)) {
                                                    
                                                    

                                                    eval('obj.props = ' + code.substring(p.node.argument.start, p.node.argument.end));
                                                    
                                                }

                                            }
                                        
                                        }
                                    }, p.scope, p.parent)

                                    p.remove();

                                }
                                
                            }
                        
                        }
                    }, p.scope, p.parent)

                    // in case render method is writtern in the front of defaultProp
                    // not to put them in the same traverse

                    traverse(p.node, {
                        enter (p) {

                            if (t.isClassMethod(p)) {
                                if (p.node.key.name == 'render') {
                                    
                                    traverse(p.node, {
                                        enter (p) {
                                            
                                            if (t.isReturnStatement(p)) {
                                                
                                                let count = 0;

                                                traverse(p.node, {
                                                    
                                                    enter (p) {
                                                        
                                                        if (t.isJSXElement(p)) {
                                                            
                                                            let elementName = p.node.openingElement.name.name;

                                                            objArr.forEach(o => {
                                                                if (o.alias == elementName) {

                                                                    let attr = Object.create(null);

                                                                    /*if (p.node.openingElement.attributes) {

                                                                        p.node.openingElement.attributes.forEach(a => {
                                                                            if (t.isJSXAttribute(a)) {
                                                                                let name = a.name.name;
                                                                                let value;
                                                                                
                                                                                if (t.isLiteral(a.value)) {
                                                                                    
                                                                                    value = a.value.value;
                                                                                
                                                                                } else if (t.isJSXExpressionContainer(a.value)) {

                                                                                    value = '$$$' + code.substring(a.value.expression.start, a.value.expression.end) + '$$$';
                                                                                }

                                                                                attr[name] = value;

                                                                            }
                                                                        })

                                                                    }*/

                                                                    o = Object.assign(Object.create(null), o);

                                                                    if (!o.props) {
                                                                        o.props = Object.create(null);
                                                                    }

                                                                    o.props = Object.assign(attr, o.props);

                                                                    if (!obj.items) {
                                                                        obj.items = [];
                                                                    }

                                                                    obj.items.push(o);

                                                                    let expression0 = `this.props.$self.items[${count++}].props`;
                                                                    let node0 = babylon.parse(expression0);
                                                                    let attrNode = t.jSXSpreadAttribute(node0.program.body[0].expression)
                                                                    if (!p.node.openingElement.attributes) {
                                                                        p.node.openingElement.attributes = [attrNode];
                                                                    } else {
                                                                        p.node.openingElement.attributes.unshift(attrNode);
                                                                    }
                                                                    

                                                                }
                                                            })
            
                                                        }
                                                    
                                                    }
                                                }, p.scope, p.parent)

                                            }
                                        
                                        }
                                    }, p.scope, p.parent)

                                }
                            }
                        
                        }
                    }, p.scope, p.parent)

                    objArr.push(obj);

                    let propAlias = 'props';

                    // rewrite constructor
                    if (!constructorNode) {
                        constructorNode = t.classMethod(
                            'method', 
                            t.identifier('constructor'), 
                            [],
                            t.blockStatement([
                                t.expressionStatement(
                                    t.callExpression(
                                        t.identifier('super'),
                                        [t.identifier(propAlias)]
                                    )
                                )
                            ])
                        );
                    } else {

                        constructorNode.body.body.unshift(
                            t.expressionStatement(
                                t.callExpression(
                                    t.identifier('super'),
                                    [t.identifier(propAlias)]
                                )
                            )
                        );

                    }

                    if (!constructorNode.params || !constructorNode.params.length) {
                        constructorNode.params = [t.identifier(propAlias)];
                    } else {
                        propAlias = constructorNode.params[0].name;
                    }

                    let expression0 = `${propAlias}.$self.ref = this;`;
                    let node0 = babylon.parse(expression0);
                    
                    constructorNode.body.body.push(node0.program.body[0]);

                    // prepend constructor
                    p.node.body.body.unshift(constructorNode);

                }



            }
        }

    });

}

module.exports = func;