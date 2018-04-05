let babylon = require('babylon');
let path = require('path');
let fs = require('fs-extra');
let ncp = require('ncp').ncp;
let traverse = require('babel-traverse').default;
let t = require('babel-types');
let resolver = require('./resolver');
let generate = require('babel-generator').default;
let beautify = require('js-beautify').js;
let prettier = require('prettier');

let cmdPath = process.cwd();
let entryPath;
let outputPath;

for (let j = 0; j < process.argv.length; j++) {
    
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
let srcFile = path.resolve(cmdPath, entryPath);
let arr = entryPath.split(path.sep);
let entryFileName = arr[arr.length - 1];
let srcDir = path.resolve(srcFile, '..');
let destDir = path.resolve(cmdPath, outputPath);
let destFile = path.resolve(destDir, entryFileName);
let destPropFile = path.resolve(destDir, 'compond.js');
let assembler = require('./assembler');


fs.ensureDirSync(destDir);
ncp(srcDir, destDir, () => {
    setTimeout(() => {

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
        let $obj;

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

                        }

                        let obj = resolver(srcFile, destFile);

                        if (obj && p.node.specifiers && p.node.specifiers.length) {

                            p.node.specifiers.forEach(n => {
                                if (t.isImportDefaultSpecifier(n)) {
                                    
                                    obj.alias = n.local.name;

                                    objArr.push(obj);

                                }
                            })
                        }

                        

                    }

                }

                if (t.isCallExpression(p.node) && 
                    t.isMemberExpression(p.node.callee) &&
                    p.node.callee.object.name == 'ReactDOM' &&
                    p.node.callee.property.name == 'render' &&
                    t.isJSXElement(p.node.arguments[0])) {

                    let el = p.node.arguments[0].openingElement;

                    objArr.forEach(obj => {
                        if (obj.alias == el.name.name || obj.className == el.name.name) {
                            $obj = obj;
                        }
                    })

                }

            }

        })

        assembler(ast, code, objArr, srcFile)

        let propCode = 
`${beautify(`let $obj = ${JSON.stringify($obj).replace(/\"\$\$\$/g, '').replace(/\$\$\$\"/g, '').replace(/\\n/g, '\n')}`)}

const recursive = o => {
    o.props.$self = o;
    if (o.items) {
        o.items.forEach(item => {
            item.parent = o;
            recursive(item);
        });
    }
};

recursive($obj);

global.$obj = $obj;
`        
        fs.writeFileSync(destPropFile, propCode)

        let expression0 = 'require(\'./compond.js\')\n';
        let expressionNode0 = babylon.parse(expression0);

        let expression1 =
`class Wrapped$ extends React.Component {
    constructor (props) {
        super(props);
        this.state = global.$obj;
        global.$obj.wrappedRef = this;
    }

    render () {
        return (<${$obj.alias} {...this.state.props} />);
    }
}
`
        let expressionNode1 = babylon.parse(expression1, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'objectRestSpread'
            ]
        });

        // re-generate

        traverse(ast, {
            
            enter (p) {


                if (t.isCallExpression(p.node) && 
                    t.isMemberExpression(p.node.callee) &&
                    p.node.callee.object.name == 'ReactDOM' &&
                    p.node.callee.property.name == 'render' &&
                    t.isJSXElement(p.node.arguments[0])) {

                    p.insertBefore(expressionNode0.program.body[0]);
                    
                    p.insertBefore(expressionNode1.program.body[0]);

                    let el = p.node.arguments[0].openingElement;

                    let attrNode = t.jSXSpreadAttribute(t.memberExpression(t.memberExpression(t.identifier('global'), t.identifier('$obj')), t.identifier('props')));

                    el.attributes = []
                    el.name = t.identifier('Wrapped$');

                }

            }

        })

        let ret = generate(ast)

        fs.writeFileSync(destFile, prettier.format(ret.code, {tabWidth: 4}))

    }, 100)
    
});



