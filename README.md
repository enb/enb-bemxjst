enb-bemxjst
===============

Short info about your package.

What does your package.

Which limits has your package.

Installation
------------

`enb-bemxjst` can be installed using `npm`:

```
npm install enb-bemxjst
```

Usage
-----

To run `enb-bemxjst`, you can use the following command from the project root:

```
./node_modules/.bin/enb-bemxjst path[ path[...]]
```

Example:

```
var HelloWorld = require('enb-bemxjst').HelloWorld;
var helloWorld = new HelloWorld();
console.log(helloWorld.calculate());
```

bemhtml
-------

Склеивает `bemhtml`-файлы по deps'ам, обрабатывает BEMXJST-транслятором, сохраняет (по умолчанию) в виде `?.bemhtml.js`.
Использует компилятор, входящий в состав библиотеки [`bem-core`](https://github.com/bem/bem-core).

**Внимание:** поддерживает только новый js-совместимый синтаксис.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
* *Boolean* **devMode** — Development-режим. По умолчанию — `true`.
* *Boolean* **cache** — Кеширование. По умолчанию — `true`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bemxjst/techs/bemhtml'));
```

Configuration
-------------

Detailed information about your package configuration.
