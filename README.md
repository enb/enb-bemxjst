enb-bemxjst
===========

[![NPM version](http://img.shields.io/npm/v/enb-bemxjst.svg?style=flat)](http://badge.fury.io/js/enb-bemxjst) [![Build Status](http://img.shields.io/travis/enb-bem/enb-bemxjst/master.svg?style=flat)](https://travis-ci.org/enb-bem/enb-bemxjst) [![Coverage Status](https://img.shields.io/coveralls/enb-bem/enb-bemxjst.svg?style=flat)](https://coveralls.io/r/enb-bem/enb-bemxjst?branch=master) [![Dependency Status](http://img.shields.io/david/enb-bem/enb-bemxjst.svg?style=flat)](https://david-dm.org/enb-bem/enb-bemxjst)

Поддержка технологий, базирующихся на основе [BEM-XJST](http://ru.bem.info/tools/templating-engines/bemxjst/), для [ENB](https://github.com/enb-make/enb.git).
Базовые шаблоны для BEMHTML и BEMTREE находятся в библиотеке [bem-core](http://ru.bem.info/libs/bem-core/v2.3.0/).

**Важно**: для технологий, базовые шаблоны которых находятся в библиотеке [bem-bl](http://ru.bem.info/libs/bem-bl/), следует использовать [enb-xjst](https://github.com/enb-bem/enb-xjst) пакет.

Установка
---------
```sh
$ npm install --save-dev enb-bemxjst
```

Для работы модуля требуется зависимость от пакета `enb` версии `0.13.0` или выше.

Технологии
----------

* [bemhtml & bemhtml-old](#bemhtml--bemhtml-old)
* [bemtree & bemtree-old](#bemtree--bemtree-old)
* [html-from-bemjson](#html-from-bemjson)
* [html-from-bemjson-i18n](#html-from-bemjson-i18n)

### Зачем нужны `*-old`-технологии?
Технологии с суффиксом `old` помимо JS-синтаксиса поддерживают ещё и первоначальный синтаксис.

Транслирование из первоначального в JS-синтаксис осуществляется с помощью [bemhtml-compat](https://github.com/bem/bemhtml-compat).

Использовать технологии с суффиксом `old` следует, когда действительно нужна поддержка первоначального синтаксиса, так как из-за транслирования сборка происходит медленнее, чем в аналогичных технологиях без суффикса.
Например, это может быть полезно при миграции c [bem-bl](https://github.com/bem/bem-bl.git) на [bem-core](https://github.com/bem/bem-core), чтобы не переписывать код всего проекта целиком, а поэтапно переходить на JS-синтаксис для каждого отдельного шаблона.

**Важно:** считается, что файлы с расширением `*.xjst` могут быть написаны только в JS-синтаксисе. Транслирование для таких файлов проводиться не будет, даже если использовать `old`-технологии.

### bemhtml & bemhtml-old

Склеивает `bemhtml.xjst` и `bemhtml`-файлы по deps'ам, обрабатывает [BEM-XJST](http://ru.bem.info/tools/templating-engines/bemxjst/)-транслятором, сохраняет (по умолчанию) в виде `?.bemhtml.js`.

**Опции**

* *String* **target** — результирующий таргет. По умолчанию — `?.bemhtml.js`.
* *String* **filesTarget** — files-таргет, на основе которого создаётся список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemhtml', 'bemhtml.xjst']`.
* *String* **exportName** — имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
* *Boolean* **devMode** — development-режим. По умолчанию — `true`.
* *Boolean* **cache** — кэширование. Возможно только в production-режиме. По умолчанию — `false`.
* *Object* **modulesDeps** — хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку необходимые YModules-модули.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml'), { devMode: false } ]);
```

### bemtree & bemtree-old

Склеивает BEMTREE-файлы по deps'ам, обрабатывает [BEM-XJST](http://ru.bem.info/tools/templating-engines/bemxjst/)-транслятором, сохраняет (по умолчанию) в виде `?.bemtree.js`.

**Опции**

* *String* **target** — результирующий таргет. По умолчанию — `?.bemtree.js`.
* *String* **filesTarget** — files-таргет, на основе которого создаётся список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemtree']`.
* *String* **exportName** — имя переменной-обработчика BEMTREE. По умолчанию — `'BEMTREE'`.
* *Boolean* **devMode** — development-режим. По умолчанию — `true`.
* *Object* **modulesDeps** — хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку необходимые YModules-модули.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree'), { devMode: false } ]);
```

### html-from-bemjson

Собирает HTML-файл с помощью BEMJSON и BEMHTML.

**Опции**

* *String* **bemhtmlFile** — исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
* *String* **bemjsonFile** — исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
* *String* **target** — результирующий HTML-файл. По умолчанию — `?.html`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bemxjst/techs/html-from-bemjson'));
```

### html-from-bemjson-i18n

Собирает HTML-файл с помощью BEMJSON, BEMHTML, `lang.all` и `lang.{lang}`.

**Опции**

* *String* **bemhtmlFile** — исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
* *String* **bemjsonFile** — исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
* *String* **langAllFile** — исходный langAll-файл. По умолчанию — `?.lang.all.js`.
* *String* **langFile** — исходный lang-файл. По умолчанию — `?.lang.{lang}.js`. Если параметр lang не указан, берётся первый из объявленных в проекте языков.
* *String* **target** — результирующий HTML-файл. По умолчанию — `?.{lang}.html`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bemxjst/techs/html-from-bemjson-i18n'));
```
Лицензия
--------

© 2013 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
