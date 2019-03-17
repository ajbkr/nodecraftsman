Node Craftsman
==============

Worked examples from Manuel Kiessling's
[Node Craftsman Book](https://leanpub.com/nodecraftsman).

I have modified some of the source code to use ES6/7 and have added linting
using [JavaScript Standard Style](https://standardjs.com/).

To run the linter:

```
$ npm run lint
```

And to execute the servers themselves:

```
$ npm start
```

All servers listen on port 3000 and can be accessed by navigating to
[http://localhost:3000/](http://localhost:3000/) in your Web browser where
appropriate.

Keyword Wrangler
----------------

Changes made to the Keyword Wrangler product featured in part 2 of the book
include:

- bower has been replaced with npm (uses a public `node_modules` directory, given this is non-production code)
- angular-grid has been replaced with ui-grid
