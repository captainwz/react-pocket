let $obj = {
    "className": "Card",
    "srcFile": "/Users/wangzhe/awesomedir/requery/example/src/Card.js",
    "props": {
        "width": 200,
        "height": 100,
        "backgroundColor": "#108ee9"
    },
    "items": [{
        "className": "Timer",
        "srcFile": "/Users/wangzhe/awesomedir/requery/example/src/Timer.js",
        "props": {},
        "items": [{
            "className": "Counter",
            "srcFile": "/Users/wangzhe/awesomedir/requery/example/src/Counter.js",
            "props": {
                "num": 0
            },
            "alias": "Counter"
        }],
        "alias": "Timer"
    }, {
        "className": "Decoration",
        "srcFile": "/Users/wangzhe/awesomedir/requery/example/src/Decoration.js",
        "props": {
            "title": "no title"
        },
        "alias": "Decoration"
    }],
    "alias": "Card"
}

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
