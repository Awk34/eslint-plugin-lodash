'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prop-shorthand');
var RuleTester = require('eslint').RuleTester;


// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
var messages = {
    always: 'Prefer property shorthand syntax',
    never: 'Do not use property shorthand syntax'
};

ruleTester.run('prop-shorthand', rule, {
    valid: [
        'var ids = _.map([], function (i) { return x.id; });',
        'var ids = _.map([], function (i) { return i.id + "?"; });',
        'var publicModules = _(files).map(readModule).compact().value();',
        'var ids = _.map([], function (i) { return i[k]; });',
        'var r = _.map([], function() { return React.PropTypes.object; })',
        'var r = _.map([])',
        {
            code: 'var r = _.map([], function(x) { return x.id})',
            options: ['never']
        },
        {
            code: 'var r = _.map([], x => x.id)',
            options: ['never'],
            parserOptions: {ecmaVersion: 6}
        }
    ],
    invalid: [{
        code: 'var ids = _(arr).map(function (i) { return i.a.b.c; });',
        errors: [{message: messages.always, column: 22}]
    }, {
        code: 'var ids = _(arr).map(_.property("a.b.c"));',
        errors: [{message: messages.always, column: 22}]
    }, {
        code: 'var ids = _.map([], function (i) { return i.a; });',
        errors: [{message: messages.always, column: 21}]
    }, {
        code: 'var ids = _(arr).filter({id: 3}).map("i.a.b");',
        options: ['never'],
        errors: [{message: messages.never, column: 38}]
    }, {
        code: 'var ids = _(arr).map("x").map("y").map(function (i) { return i.a.b; });',
        errors: [{message: messages.always, column: 40}]
    }, {
        code: 'var ids = _.map([], function (i) { return i["a"]; });',
        errors: [{message: messages.always, column: 21}]
    }, {
        code: 'var ids = _.map([], i => i.a.b.c);',
        parserOptions: {ecmaVersion: 6},
        errors: [{message: messages.always, column: 21}]
    }, {
        code: 'var ids = _.map(arr, "id");',
        options: ['never'],
        errors: [{message: messages.never, column: 22}]
    }]
});
