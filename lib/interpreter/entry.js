'use strict';

var babylon = require('babylon');
var path = require('path');
var fs = require('fs-extra');
var ncp = require('ncp').ncp;
var traverse = require('babel-traverse').default;
var t = require('babel-types');
var resolver = require('./resolver');
var generate = require('babel-generator').default;
var beautify = require('js-beautify').js;
var prettier = require('prettier');

var cmdPath = process.cwd();
var entryPath = void 0;
var outputPath = void 0;

for (var j = 0; j < process.argv.length; j++) {

    if (process.argv[j] == '--entry') {
        entryPath = process.argv[j + 1];
    }

    if (process.argv[j] == '--output') {
        outputPath = process.argv[j + 1];
    }
}

if (!entryPath) {
    console.error('Please specify the entry file path with --entry /path/to/file');
    process.exit();
}

if (!outputPath) {
    console.error('Please specify the output directory path with --out /path/to/directory');
    process.exit();
}

// let projectPath = path.resolve(__dirname, '../../');
var srcFile = path.resolve(cmdPath, entryPath);
var arr = entryPath.split(path.sep);
var entryFileName = arr[arr.length - 1];
var srcDir = path.resolve(srcFile, '..');
var destDir = path.resolve(cmdPath, outputPath);
var destFile = path.resolve(destDir, entryFileName);
var destPropFile = path.resolve(destDir, 'compond.js');
var assembler = require('./assembler');

fs.ensureDirSync(destDir);
ncp(srcDir, destDir, function () {
    setTimeout(function () {

        var code = fs.readFileSync(srcFile).toString();
        var ast = babylon.parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'doExpressions', 'objectRestSpread']
        });

        var objArr = [];
        var $obj = void 0;

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
                        }

                        var obj = resolver(_srcFile, _destFile);

                        if (obj && p.node.specifiers && p.node.specifiers.length) {

                            p.node.specifiers.forEach(function (n) {
                                if (t.isImportDefaultSpecifier(n)) {

                                    obj.alias = n.local.name;

                                    objArr.push(obj);
                                }
                            });
                        }
                    }
                }

                if (t.isCallExpression(p.node) && t.isMemberExpression(p.node.callee) && p.node.callee.object.name == 'ReactDOM' && p.node.callee.property.name == 'render' && t.isJSXElement(p.node.arguments[0])) {

                    var el = p.node.arguments[0].openingElement;

                    objArr.forEach(function (obj) {
                        if (obj.alias == el.name.name || obj.className == el.name.name) {
                            $obj = obj;
                        }
                    });
                }
            }
        });

        assembler(ast, code, objArr, srcFile);

        var propCode = beautify('let $obj = ' + JSON.stringify($obj).replace(/\"\$\$\$/g, '').replace(/\$\$\$\"/g, '').replace(/\\n/g, '\n')) + '\n\nconst recursive = o => {\n    o.props.$self = o;\n    if (o.items) {\n        o.items.forEach(item => {\n            item.parent = o;\n            recursive(item);\n        });\n    }\n};\n\nrecursive($obj);\n\nglobal.$obj = $obj;\n';
        fs.writeFileSync(destPropFile, propCode);

        var expression0 = 'require(\'./compond.js\')\n';
        var expressionNode0 = babylon.parse(expression0);

        var expression1 = 'class Wrapped$ extends React.Component {\n    constructor (props) {\n        super(props);\n        this.state = global.$obj;\n        global.$obj.wrappedRef = this;\n    }\n\n    render () {\n        return (<' + $obj.alias + ' {...this.state.props} />);\n    }\n}\n';
        var expressionNode1 = babylon.parse(expression1, {
            sourceType: 'module',
            plugins: ['jsx', 'objectRestSpread']
        });

        // re-generate

        traverse(ast, {
            enter: function enter(p) {

                if (t.isCallExpression(p.node) && t.isMemberExpression(p.node.callee) && p.node.callee.object.name == 'ReactDOM' && p.node.callee.property.name == 'render' && t.isJSXElement(p.node.arguments[0])) {

                    p.insertBefore(expressionNode0.program.body[0]);

                    p.insertBefore(expressionNode1.program.body[0]);

                    var el = p.node.arguments[0].openingElement;

                    var attrNode = t.jSXSpreadAttribute(t.memberExpression(t.memberExpression(t.identifier('global'), t.identifier('$obj')), t.identifier('props')));

                    el.attributes = [];
                    el.name = t.identifier('Wrapped$');
                }
            }
        });

        var ret = generate(ast);

        fs.writeFileSync(destFile, prettier.format(ret.code, { tabWidth: 4 }));
    }, 100);
});