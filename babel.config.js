const plugins = [[
    "import",
    {
        "libraryName": "iview",
        "libraryDirectory": "src/components"
    }
],"syntax-dynamic-import","dynamic-import-webpack",
["@babel/plugin-proposal-decorators",{"legacy": true}],["@babel/plugin-proposal-class-properties",{"loose": true}]
];
if(['production','prod'].includes(process.env.NODE_ENV)) {
    plugins.push("transform-remove-console")
}

module.exports = {
    presets: [["@vue/app",{"useBuiltIns": "entry"}]],
    plugins: plugins
}
