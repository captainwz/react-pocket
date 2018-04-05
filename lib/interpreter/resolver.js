'use strict';

var babylon = require('babylon');
var path = require('path');
var fs = require('fs-extra');
var traverse = require('babel-traverse').default;
var t = require('babel-types');
var assembler = require('./assembler');
var generate = require('babel-generator').default;
var prettier = require('prettier');

var func = function func(srcFile, destFile) {
    var code = fs.readFileSync(srcFile).toString();
    var ast = babylon.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'doExpressions', 'objectRestSpread']
    });

    var objArr = [];
    var importArr = [];
    var exportObj = void 0;

    var srcDir = path.resolve(srcFile, '..');
    var destDir = path.resolve(destFile, '..');

    traverse(ast, {
        enter: function enter(p) {
            if (t.isImportDeclaration(p.node)) {

                if (/^\./.test(p.node.source.value)) {

                    var value = p.node.source.value;
                    var _srcFile = void 0;
                    var _destFile = void 0;

                    if (!/\.jsx{0,1}$/.test(value)) {

                        if (fs.existsSync(path.resolve(srcDir, value + '.js'))) {

                            _srcFile = path.resolve(srcDir, value + '.js');
                            _destFile = path.resolve(destDir, value + '.js');
                        } else if (fs.existsSync(path.resolve(srcDir, value + '.jsx'))) {

                            _srcFile = path.resolve(srcDir, value + '.jsx');
                            _destFile = path.resolve(destDir, value + '.jsx');
                        }
                    } else {

                        _srcFile = path.resolve(srcDir, value);
                        _destFile = path.resolve(destDir, value);
                    }

                    var obj = func(_srcFile, _destFile);

                    if (obj && p.node.specifiers && p.node.specifiers.length) {

                        p.node.specifiers.forEach(function (n) {
                            if (t.isImportDefaultSpecifier(n)) {

                                obj.alias = n.local.name;

                                objArr.push(obj);
                            }
                        });
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
        enter: function enter(p) {

            if (t.isExportDefaultDeclaration(p.node)) {

                var className = void 0;

                if (t.isClassDeclaration(p.node.declaration)) {

                    className = p.node.declaration.id.name;
                } else if (t.isIdentifier(p.node.declaration)) {

                    className = p.node.declaration.name;
                }

                objArr.forEach(function (obj) {
                    if (obj.className == className || obj.alias == className) {
                        exportObj = obj;
                    }
                });
            }
        }
    });

    // add necessray code to it
    traverse(ast, {
        enter: function enter(p) {

            if (t.isProgram(p.node)) {
                var expression = 'import React, {Component} from \'react\'';
                var node = babylon.parse(expression, { sourceType: 'module' });
                p.node.body.unshift(node.program.body[0]);
            }
        }
    });

    var ret = generate(ast);

    if (exportObj) {

        fs.writeFileSync(destFile, prettier.format(ret.code, { tabWidth: 4 }));
    }

    return exportObj;
};

module.exports = func;