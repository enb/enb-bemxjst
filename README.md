enb-bemxjst [![NPM version](https://badge.fury.io/js/enb-bemxjst.png)](http://badge.fury.io/js/enb-bemxjst) [![Build Status](https://travis-ci.org/enb-make/enb-bemxjst.png?branch=master)](https://travis-ci.org/enb-make/enb-bemxjst)  [![Dependency Status](https://david-dm.org/enb-make/enb-bemxjst.png)](https://david-dm.org/enb-make/enb-bemxjst)
===========

Поддержка технологий, базирующихся на&nbsp;основе [`bem-xjst`](https://github.com/bem/bem-xjst), для [`ENB`](https://github.com/enb-make/enb.git).
Базовые шаблоны для `bemhtml` и&nbsp;`bemtree` находятся в&nbsp;библиотеке [`bem-core`](https://github.com/bem/bem-core.git).

**Внимание**: для технологий, базовые шаблоны которых находятся в&nbsp;библиотеке [`bem-bl`](https://github.com/bem/bem-bl.git) следует использовать [`enb-bemhtml`](https://github.com/enb-make/enb-bemhtml) пакет.

Установка
---------
```
npm install enb-bemxjst
```

Технологии
----------

* [bemhtml & bemhtml-old](#bemhtml--bemhtml-old)
* [bemtree & bemtree-old](#bemtree--bemtree-old)

### Зачем нужны `*-old` технологии?
Технологии с&nbsp;суффиксом `old` помимо js-синтаксиса поддерживают ещё и первоначальный синтаксис.

Транслирование из&nbsp;первоначального в&nbsp;js-синтаксиса осуществляется с&nbsp;помощью [`bemhtml-compat`](https://github.com/bem/bemhtml-compat).

Использовать технологии с&nbsp;суффиксом `old` следует когда действительно нужна поддержка первоначального синтаксиса, т.к. из-за транслирования сборка будет происходить медленнее, чем в аналогичных технологиях без суффикса.
Например, это может быть полезно при миграции c&nbsp;[`bem-bl`](https://github.com/bem/bem-bl.git) на [`bem-core`](https://github.com/bem/bem-core), чтобы не переписывать код всего проекта целиком, а поэтапно переходить на js-синтаксис для каждого отдельного шаблона.

**Внимание:** считается, что файлы с&nbsp;расширением `*.xjst` могут быть написаны только в js-синтаксисе.
Транслирование для таких файлов проводиться не&nbsp;будет, даже если использовать `old`-технологии.

bemhtml & bemhtml-old
=====================

Склеивает `bemhtml.xjst` и&nbsp;`bemhtml`-файлы по&nbsp;deps'ам, обрабатывает [`bem-xjst`](https://github.com/bem/bem-xjst)-транслятором, сохраняет (по&nbsp;умолчанию) в&nbsp;виде `?.bemhtml.js`.

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemhtml.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMHTML. По&nbsp;умолчанию&nbsp;— `'BEMHTML'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).
* *Boolean* **cache**&nbsp;— Кэширование. Возможно только в&nbsp;dev-режиме. По&nbsp;умолчанию&nbsp;— `true`.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml'), { devMode: false } ]);
```

bemtree & bemtree-old
=====================

Склеивает `bemtree`-файлы по&nbsp;deps'ам, обрабатывает [`bem-xjst`](https://github.com/bem/bem-xjst)-транслятором, сохраняет (по&nbsp;умолчанию) в&nbsp;виде `?.bemtree.js`.

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemtree.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMTREE. По&nbsp;умолчанию&nbsp;— `'BEMTREE'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree'), { devMode: false } ]);
```
