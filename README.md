enb-bemxjst [![Build Status](https://travis-ci.org/enb-make/enb-bemxjst.png?branch=master)](https://travis-ci.org/enb-make/enb-bemxjst) [![NPM version](https://badge.fury.io/js/enb-bemxjst.png)](http://badge.fury.io/js/enb-bemxjst)
===========

Поддержка технологий, базирующихся на&nbsp;основе [`bem-xjst`](https://github.com/bem/bem-xjst), для [`enb`](https://github.com/enb-make/enb.git).

Если вы&nbsp;хотите использовать только `bemhtml` технологию без поддержки нового синтаксиса или библиотеки (например, [`bem-bl`](https://github.com/bem/bem-bl.git)) с&nbsp;подобным подходом, то, возможно, вам лучше подойдёт [`enb-bemhtml`](https://github.com/enb-make/enb-bemhtml.git).

Установка
---------

`enb-bemxjst` можно установить с&nbsp;помощью `npm`:

```
npm install enb-bemxjst
```

Технологии
----------

### bemhtml

Склеивает `bemhtml.xjst` и&nbsp;`bemhtml`-файлы по&nbsp;deps'ам, обрабатывает BEMXJST-транслятором, сохраняет (по&nbsp;умолчанию) в&nbsp;виде `?.bemhtml.js`.
Использует компилятор, входящий в&nbsp;состав библиотеки [`bem-core`](https://github.com/bem/bem-core).

**Внимание:** поддерживает только новый js-совместимый синтаксис.

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemhtml.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMHTML. По&nbsp;умолчанию&nbsp;— `'BEMHTML'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).
* *Boolean* **cache**&nbsp;— Кеширование. По&nbsp;умолчанию&nbsp;— `true`.

**Пример**

```javascript
nodeConfig.addTech(new (require('enb-bemxjst/techs/bemhtml'))({ devMode: false }));
```

### bemhtml-old

Склеивает `bemhtml.xjst` и `bemhtml`-файлы по deps'ам, обрабатывает BEMXJST-транслятором, сохраняет (по умолчанию) в виде`?.bemhtml.js`.
Использует компилятор, входящий в состав библиотеки [`bem-core`](https://github.com/bem/bem-core).

Поддерживает как новый js-совместимый, так и старый синтаксис.
Транслирование из старого синтаксиса в новый осуществляется с помощью библиотеки [`bemhtml-compat`](https://github.com/bem/bemhtml-compat).

**Внимание:** считается, что файлы с суффиксом `*.xjst` могут быть написаны только в новом синтаксисе (старый синтаксис не поддерживается).

**Опции**

* *String* **target**&nbsp;— Результирующий таргет. По&nbsp;умолчанию&nbsp;— `?.bemhtml.js`.
* *String* **filesTarget**&nbsp;— files-таргет, на&nbsp;основе которого получается список исходных файлов (его предоставляет технология `files`). По&nbsp;умолчанию&nbsp;— `?.files`.
* *String* **exportName**&nbsp;— Имя переменной-обработчика BEMHTML. По&nbsp;умолчанию&nbsp;— `'BEMHTML'`.
* *Boolean* **devMode**&nbsp;— Development-режим. По&nbsp;умолчанию зависит от&nbsp;`YENV` (`true`, если `YENV=development`).
* *Boolean* **cache**&nbsp;— Кеширование. По&nbsp;умолчанию&nbsp;— `true`.

**Пример**

```javascript
nodeConfig.addTech(new (require('enb-bemxjst/techs/bemhtml-old'))({ devMode: false }));
```
