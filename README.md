enb-bemxjst
===========

[![NPM version](https://img.shields.io/npm/v/enb-bemxjst.svg?style=flat)](https://www.npmjs.org/package/enb-bemxjst) [![Build Status](https://img.shields.io/travis/enb-bem/enb-bemxjst/master.svg?style=flat&label=tests)](https://travis-ci.org/enb-bem/enb-bemxjst) [![Build status](https://img.shields.io/appveyor/ci/blond/enb-bemxjst.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/enb-bemxjst) [![Coverage Status](https://img.shields.io/coveralls/enb-bem/enb-bemxjst.svg?style=flat)](https://coveralls.io/r/enb-bem/enb-bemxjst?branch=master) [![Dependency Status](https://img.shields.io/david/enb-bem/enb-bemxjst.svg?style=flat)](https://david-dm.org/enb-bem/enb-bemxjst)

Поддержка технологий, базирующихся на основе [BEM-XJST](https://ru.bem.info/tools/templating-engines/bemxjst/), для [ENB](https://github.com/enb-make/enb.git).
Базовые шаблоны для BEMHTML и BEMTREE находятся в библиотеке [bem-core](https://ru.bem.info/libs/bem-core/v2.3.0/).

**Важно**: для технологий, базовые шаблоны которых находятся в библиотеке [bem-bl](https://ru.bem.info/libs/bem-bl/), следует использовать [enb-xjst](https://github.com/enb-bem/enb-xjst) пакет.

Установка
---------
```sh
$ npm install --save-dev enb-bemxjst
```

Для работы модуля требуется зависимость от пакета `enb` версии `0.13.0` или выше.

Технологии
----------

* [bemhtml](#bemhtml)
* [bemtree](#bemtree)
* [bemjson-to-html](#bemjson-to-html)

### bemhtml

Склеивает `bemhtml`-файлы по deps'ам, обрабатывает [BEM-XJST](https://ru.bem.info/tools/templating-engines/bemxjst/)-транслятором, сохраняет (по умолчанию) в виде `?.bemhtml.js`.

**Опции**

* *String* **target** — результирующий таргет. По умолчанию — `?.bemhtml.js`.
* *String* **filesTarget** — files-таргет, на основе которого создаётся список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemhtml']`.
* *String* **exportName** — имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
* *Boolean* **compat** — Поддержка первоначального синтаксиса. По умолчанию — false.
* *Boolean* **devMode** — development-режим. По умолчанию — `true`.
* *Boolean* **cache** — кэширование. Возможно только в production-режиме. По умолчанию — `false`.
* *Object* **modulesDeps** — хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку необходимые YModules-модули.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml'), { devMode: false } ]);
```

### bemtree

Склеивает BEMTREE-файлы по deps'ам, обрабатывает [BEM-XJST](https://ru.bem.info/tools/templating-engines/bemxjst/)-транслятором, сохраняет (по умолчанию) в виде `?.bemtree.js`.

**Опции**

* *String* **target** — результирующий таргет. По умолчанию — `?.bemtree.js`.
* *String* **filesTarget** — files-таргет, на основе которого создаётся список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemtree']`.
* *String* **exportName** — имя переменной-обработчика BEMTREE. По умолчанию — `'BEMTREE'`.
* *Boolean* **compat** — Поддержка первоначального синтаксиса. По умолчанию — false.
* *Boolean* **devMode** — development-режим. По умолчанию — `true`.
* *Object* **modulesDeps** — хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку необходимые YModules-модули.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree'), { devMode: false } ]);
```

### bemjson-to-html

Собирает HTML-файл с помощью BEMJSON и BEMHTML.

**Опции**

* *String* **bemhtmlFile** — исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
* *String* **bemjsonFile** — исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
* *String* **target** — результирующий HTML-файл. По умолчанию — `?.html`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-bemxjst/techs/bemjson-to-html'));
```

### Первоначальный синтаксис

Чтобы включить поддержку первоначального синтаксиса, нужно использовать `compat` опцию. Например, это может быть полезно при миграции c [bem-bl](https://github.com/bem/bem-bl.git) на [bem-core](https://github.com/bem/bem-core), чтобы не переписывать код всего проекта целиком, а поэтапно переходить на JS-синтаксис для каждого отдельного шаблона.

Транслирование из первоначального в JS-синтаксис осуществляется с помощью [bemhtml-compat](https://github.com/bem/bemhtml-compat).

Из-за транслирования сборка происходит медленнее даже для файлов в JS-синтаксисе.

Лицензия
--------

© 2013 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
