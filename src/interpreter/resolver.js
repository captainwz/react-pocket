let babylon = require('babylon');
let path = require('path');
let fs = require('fs-extra');
let traverse = require('babel-traverse').default;
let t = require('babel-types');
let assembler = require('./assembler');
let generate = require('babel-generator').default;
let prettier = require('prettier');

const func = (srcFile, destFile) => {
    let code = fs.readFileSync(srcFile).toString();
    let ast = babylon.parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx',
            'doExpressions',
            'objectRestSpread'
        ]
    });
    
    let objArr = [];
    let importArr = [];
    let exportObj;

    let srcDir = path.resolve(srcFile, '..');
    let destDir = path.resolve(destFile, '..')

    traverse(ast, {
        enter (p) {
            if (t.isImportDeclaration(p.node)) {

                if (/^\./.test(p.node.source.value)) {
    
                    let value = p.node.source.value;
                    let srcFile;
                    let destFile;
    
                    if (!/\.jsx{0,1}$/.test(value)) {
    
                        if (fs.existsSync(path.resolve(srcDir, value + '.js'))) {
    
                            srcFile = path.resolve(srcDir, value + '.js');
                            destFile = path.resolve(destDir, value + '.js')
    
                        } else if (fs.existsSync(path.resolve(srcDir, value + '.jsx'))) {
    
                            srcFile = path.resolve(srcDir, value + '.jsx');
                            destFile = path.resolve(destDir, value + '.jsx')
    
                        }
    
                    } else {

                        srcFile = path.resolve(srcDir, value);
                        destFile = path.resolve(destDir, value);

                    }
    
                    let obj = func(srcFile, destFile);

                    if (obj && p.node.specifiers && p.node.specifiers.length) {

                        p.node.specifiers.forEach(n => {
                            if (t.isImportDefaultSpecifier(n)) {
                                
                                obj.alias = n.local.name;

                                objArr.push(obj);

                            }
                        })
                    }
    
                }

                if (p.node.source.value == 'react') {
                    p.remove();
                }
    
            }
        }
    });

    assembler(ast, code, objArr, srcFile);

    traverse(ast, {
    
        enter (p) {


            if (t.isExportDefaultDeclaration(p.node)) {

                let className;
                
                if (t.isClassDeclaration(p.node.declaration)) {


                    className = p.node.declaration.id.name;
                    

                } else if (t.isIdentifier(p.node.declaration)) {
                    
                    className = p.node.declaration.name;

                }

                objArr.forEach(obj => {
                    if (obj.className == className || obj.alias == className) {
                        exportObj = obj;
                    }
                })

            }

        }

    })

    // add necessray code to it
    traverse(ast, {
            
        enter (p) {

            if (t.isProgram(p.node)) {
                let expression = 'import React, {Component} from \'react\'';
                let node = babylon.parse(expression, {sourceType: 'module'});
                p.node.body.unshift(node.program.body[0]);
            }

        }
    });

    let ret = generate(ast)

    if (exportObj) {

        fs.writeFileSync(destFile, prettier.format(ret.code, {tabWidth: 4}))

    }

    return exportObj;

}

module.exports = func;

