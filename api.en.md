# Technologies API

The package includes the following technologies:

* [bemhtml](#bemhtml) – for building templates.
* [bemtree](#bemtree) – for building templates.
* [bemjson-to-html](#bemjson-to-html) – for generating HTML.

## bemhtml

Collects `bemhtml.js` files for blocks in a single file: a `?.bemhtml.js` bundle, which is used for working both in the browser and in Node.js. It does not require connecting the template source files.

Supports [YModules](https://github.com/ymaps/modules/blob/master/README.md) and partially supports [CommonJS](http://www.commonjs.org), since `require` will not work correctly in `bemhtml.js` files.

If the executable environment doesn't have any modular systems, the module will be provided to the `BEMHTML` global variable.

### Options

Options are specified in the configuration file (`.enb/make.js`).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [requires](#requires)
* [exportName](#exportname)
* [forceBaseTemplates](#forcebasetemplates)
* [engineOptions](#engineoptions)
* [naming](#naming)

### target

Type: `String`. Default: `? .bemhtml.js`.

The name of the compiled file for saving the build result with the necessary `bemhtml.js` project files.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The file list is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['bemhtml.js']`.

The file suffixes to use for filtering BEMHTML template files for the build.

#### requires

Type: `Object`. Default: `{}`.

Specifies the names or paths for connecting third-party libraries.

> For information on how it works, see the section [Connecting third-party libraries](README.md).

#### exportName

Type: `String`. Default: `BEMHTML`.

The name for accessing the BEMHTML module. The ways it can be used depend on whether a modular system is available, and what type it is. This module can be used in the following cases:

* Template execution in Node.js.

  ```js
  var BEMHTML = require('bundle.bemhtml.js').BEMHTML;

  BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  ```

* Template execution in a browser without a modular system.

  ```js
  BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  ```

* Template execution in a browser with [YModules](https://github.com/ymaps/modules/blob/master/README.md).

  ```js
  modules.require(['BEMHTML'], function(BEMHTML) {
      BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  });
  ```

#### forceBaseTemplates

Type: `Boolean`. Default: `false`.

Whether to include the kernel in the build, if there are no custom templates.

By default, if there are no custom templates, then the `bem-xjst` kernel code is not included in the assembly, either.

#### engineOptions

Type: `Object`. Default: `{}`.

Passes the BEMHTML engine [settings]( https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#settings) for `bem-xjst`.

#### naming

Deprecated. Use `engineOptions.naming`.

Type: `Object`. Default: `{ elem: '__', mod: '_' }`.

The naming convention for BEM entities for generating CSS classes:

* **String** `elem` – Separates the name of the element from the block.
* **String** `mod` – Separates the names and values ​​of modifiers from blocks and elements.

**Example**

```js
{
    block : 'button',
    mods : { disabled : true },
    content : 'Inactive'
}
```

By default, CSS classes will be generated according to the original naming convention for BEM entities.

```html
<button class="button button_disabled">Inactive</button>
```

To follow [Two Dashes style](https://github.com/bem-sdk-archive/bem-naming#two-dashes-style), use `--` to separate the modifier.

```js
naming: { elem: '__', mod: '--' }
```

The result is the following HTML:

```html
<button class="button button--disabled">Inactive</button>
```

**Example**

```js
var BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

 module.exports = function(config) {
     config.node('bundle', function(node) {
         // Getting the FileList
         node.addTechs([
             [FileProvideTech, { target: '?.bemdecl.js' }],
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Creating a BEMHTML file
         node.addTech(BemhtmlTech);
         node.addTarget('?.bemhtml.js');
     });
 };
```

## bemtree

Collects `bemtree.js` files for blocks in a single file: a `? .bemtree.js`bundle, which is used for working both in the browser and in `Node.js`. It does not require connecting the template source files.

Supports [YModules](https://github.com/ymaps/modules/blob/master/README.md) and partially supports [CommonJS](http://www.commonjs.org/), since `require` will not work correctly in `bemhtml.js` files.

If the executable environment doesn't have any modular systems, the module will be provided to the `BEMTREE` global variable.

### Options

Options are specified in the configuration file (`.enb/make.js`).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [requires](#requires)
* [exportName](#exportname)
* [forceBaseTemplates](#forceBaseTemplates)
* [engineOptions](#engineoptions-1)

### target

Type: `String`. Default: `?.bemtree.js`.

The name of the compiled file for saving the build result with the necessary `bemtree.js` project files.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The file list is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['bemtree.js']`.

The file suffixes to use for filtering BEMHTML template files for the build.

#### requires

Type: `Object`. Default: `{}`.

Specifies the names or paths for connecting third-party libraries.

> For information on how it works, see the section [Connecting third-party libraries](README.md).

#### exportName

Type: `String`. Default: `BEMTREE`.

The name for accessing the BEMTREE module. The ways it can be used depend on whether a modular system is available, and what type it is. This module can be used in the following cases:

* Template execution in Node.js.

  ```js
  var BEMTREE = require('bundle.bemtree.js').BEMTREE;

  BEMTREE.apply({ block: 'page' }); // { block: 'page', content: [...] }
  ```

* Template execution in a browser without a modular system.

  ```js
  BEMTREE.apply({ block: 'page' }); // { block: 'page', content: [...] }
  ```

* Template execution in a browser with [YModules](https://github.com/ymaps/modules/blob/master/README.md).

  ```js
  modules.require(['BEMTREE'], function(BEMTREE) {
      BEMTREE.apply({ block: 'button' }); // { block: 'page', content: [...] }
  });
  ```

#### forceBaseTemplates

Type: `Boolean`. Default: `false`.

Whether to include the kernel in the build, if there are no custom templates.

By default, if there are no custom templates, then the `bem-xjst`  kernel code is not included in the assembly, either.

#### engineOptions

Type: `Object`. Default: `{}`.

Passes the BEMTREE engine [settings](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#settings) for `bem-xjst`.

**Example**

```js
var BemtreeTech = require('enb-bemxjst/techs/bemtree'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

 module.exports = function(config) {
     config.node('bundle', function(node) {
         // Getting the FileList
         node.addTechs([
             [FileProvideTech, { target: '?.bemdecl.js' }],
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Creating a BEMTREE file
         node.addTech(BemtreeTech);
         node.addTarget('?.bemtree.js');
     });
 };
```

## bemjson-to-html

Designed for generating an HTML file. Accepts [BEMJSON](https://en.bem.info/platform/bemjson/) and a compiled `?.bemhtml.js` file (resulting from [bemhtml](#bemhtml) technologies) and returns HTML (a `?.html` file).

### Options

Options are specified in the configuration file (`.enb/make.js`).

* [target](#target-2)
* [bemhtmlFile](#bemhtmlfile)
* [bemjsonFile](#bemjsonfile)

#### target

Type: `String`. Default: `?.html`.

The HTML file is the result of applying the compiled templates to the specified BEMJSON file.

#### bemhtmlFile

Type: `String`. Default: `? .bemhtml.js`.

The name of the file that contains the templates that were compiled using the [bemhtml](#bemhtml) technology. Used for converting BEMJSON to HTML.

#### bemjsonFile

Type: `String`. Default: `?.bemjson.js`.

The name of the BEMJSON file to apply the compiled `?.bemhtml.js` template to (resulting from [bemhtml](#bemhtml)) in order to get HTML.

**Example**

```js
var BemjsonToHtmlTech = require('enb-bemxjst/techs/bemjson-to-html'),
    BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the BEMJSON file
        node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);

        // Getting the FileList
        node.addTechs([
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.bemjsonToBemdecl],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Compiling the BEMHTML file
        node.addTech(BemhtmlTech);
        node.addTarget('?.bemhtml.js');

        // Creating the HTML file
        node.addTech(BemjsonToHtmlTech);
        node.addTarget('?.html');
    });
};
```
