enb-bemxjst [![Build Status](https://travis-ci.org/enb-make/enb-bemxjst.png?branch=master)](https://travis-ci.org/enb-make/enb-bemxjst) [![NPM version](https://badge.fury.io/js/enb-bemxjst.png)](http://badge.fury.io/js/enb-bemxjst)
===========

Поддержка технологий, базирующихся на&nbsp;основе [`bem-xjst`](https://github.com/bem/bem-xjst), для [`enb`](https://github.com/enb-make/enb.git).
Базовые шаблоны для `bemhtml` и `bemtree` находятся в библиотеке [`bem-core`](https://github.com/bem/bem-core.git).

**Внимание**: для технологий, базовые шаблоны которых находятся в библиотеке [`bem-bl`](https://github.com/bem/bem-bl.git) следует использовать [`enb-bemhtml`](https://github.com/enb-make/enb-bemhtml) пакет.

Установка
---------

`enb-bemxjst` можно установить с&nbsp;помощью `npm`:

```
npm install enb-bemxjst
```

Технологии
----------

* [bemhtml и bemhtml-old](#bemhtml-%D0%B8-bemhtml-old)
* [bemtree и bemtree-old](#bemtree-%D0%B8-bemtree-old)

### Как это работает?
Технологии склеивают файлы по&nbsp;deps'ам и обрабатывают BEMXJST-транслятором, входящим в&nbsp;состав библиотеки [`bem-xjst`](https://github.com/bem/bem-xjst).

### Зачем нужны `*-old` технологии?
Технологии с суффиксом `old` помимо js-синтаксиса поддерживают ещё и первоначальный синтаксис.

Транслирование из первоначального в js-синтаксиса осуществляется с помощью [`bemhtml-compat`](https://github.com/bem/bemhtml-compat).

Использовать технологии с суффиксом `old` следует когда действительно нужна поддержка первоначального синтаксиса, т.к. из-за транслирования сборка будет происходить медленнее, чем в аналогичных технологиях без суффикса.
Например, это может быть полезно при миграции c [`bem-bl`](https://github.com/bem/bem-bl.git) на [`bem-core`](https://github.com/bem/bem-core), чтобы не переписывать код всего проекта целиком, а поэтапно переходить на js-синтаксис для каждого отдельного шаблона.

**Внимание:** считается, что файлы с расширением `*.xjst` могут быть написаны только в js-синтаксисе.
Транслирование для таких файлов проводиться не будет, даже если использовать `old`-технологии.

### `bemhtml` и `bemhtml-old`

Сохраняет (по&nbsp;умолчанию) в&nbsp;виде `?.bemhtml.js`.

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemhtml.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMHTML. По&nbsp;умолчанию&nbsp;— `'BEMHTML'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).
* *Boolean* **cache**&nbsp;— Кэширование. По&nbsp;умолчанию&nbsp;— `true`.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml'), { devMode: false } ]);
```

### `bemtree` и `bemtree-old`

Сохраняет (по&nbsp;умолчанию) в&nbsp;виде `?.bemtree.js`.

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemtree.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMTREE. По&nbsp;умолчанию&nbsp;— `'BEMTREE'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).

**Пример**

```javascript
nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree'), { devMode: false } ]);
```