enb-bemxjst
===========

[![NPM version](https://img.shields.io/npm/v/enb-bemxjst.svg?style=flat)](https://www.npmjs.org/package/enb-bemxjst) [![Build Status](https://img.shields.io/travis/enb-bem/enb-bemxjst/master.svg?style=flat&label=tests)](https://travis-ci.org/enb-bem/enb-bemxjst) [![Build status](https://img.shields.io/appveyor/ci/blond/enb-bemxjst.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/enb-bemxjst) [![Coverage Status](https://img.shields.io/coveralls/enb-bem/enb-bemxjst.svg?style=flat)](https://coveralls.io/r/enb-bem/enb-bemxjst?branch=master) [![Dependency Status](https://img.shields.io/david/enb-bem/enb-bemxjst.svg?style=flat)](https://david-dm.org/enb-bem/enb-bemxjst)

Пакет предоставляет набор [ENB](https://ru.bem.info/tools/bem/enb-bem/)-технологий для сборки [BEMHTML](https://ru.bem.info/technology/bemhtml/current/reference/)- и [BEMTREE](https://ru.bem.info/technology/bemtree/)-шаблонов в проектах, построенных по [методологии БЭМ](https://ru.bem.info/method/).

**Важно**: базовые шаблоны для BEMHTML и BEMTREE находятся в библиотеке [bem-core](https://ru.bem.info/libs/bem-core/). Для технологий, базовые шаблоны которых находятся в библиотеке [bem-bl](https://ru.bem.info/libs/bem-bl/), следует использовать пакет [enb-xjst](https://ru.bem.info/tools/bem/enb-xjst/readme/).

**Технологии пакета `enb-bemxjst`:**

* [bemhtml](api.ru.md#bemhtml)
* [bemtree](api.ru.md#bemtree)
* [bemjson-to-html](api.ru.md#bemjson-to-html)

Принципы работы технологий и их API описаны в документе [API технологий](api.ru.md).

**Совместимость:** технологии пакета `enb-bemxjst` используют [компилятор BEM-XJST](https://ru.bem.info/tools/templating-engines/bemxjst/) версии `1.2.1`.

Установка
---------

Установите пакет `enb-bemxjst`:

```sh
$ npm install --save-dev enb-bemxjst
```

**Требования:** зависимость от пакета `enb` версии `0.16.0` и выше.

Обзор документа
---------------

* [Быстрый старт](#Быстрый-старт)
* [Работа с технологиями](#Работа-с-технологиями)
    * [Исполнение шаблонов в Node.js](#Исполнение-шаблонов-в-nodejs)
    * [Исполнение шаблонов в браузере](#Исполнение-шаблонов-в-браузере)
    * [Использование шаблонов для сборки HTML](#Использование-шаблонов-для-сборки-html)
* [Особенности работы пакета](#Особенности-работы-пакета)
    * [Подключение сторонних библиотек](#Подключение-сторонних-библиотек)
    * [Синтаксис](#Синтаксис)
    * [Асинхронная шаблонизация](#Асинхронная-шаблонизация)
    * [Интернационализация](#Интернационализация)
* [Дополнительная документация](#Дополнительная-документация)

Быстрый старт
-------------

Подключите необходимые технологии: [bemhtml](api.ru.md#bemhtml), [bemtree](api.ru.md#bemtree).

```js
var BemtreeTech = require('enb-bemxjst/techs/bemtree'),
    BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

 module.exports = function(config) {
     config.node('bundle', function(node) {
         // Получаем FileList
         node.addTechs([
             [FileProvideTech, { target: '?.bemdecl.js' }],
             [bemTechs.levels, levels: ['blocks']],
             bemTechs.deps,
             bemTechs.files
         ]);

         // Создаем BEMTREE-файл
         node.addTech(BemtreeTech);
         node.addTarget('?.bemtree.js');

         // Создаем BEMHTML-файл
         node.addTech(BemhtmlTech);
         node.addTarget('?.bemhtml.js');
     });
 };
```

Для сборки HTML используйте технологию [bemjson-to-html](api.ru.md#bemjson-to-html).

```js
var BemjsonToHtmlTech = require('enb-bemxjst/techs/bemjson-to-html'),
    BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем BEMJSON-файл
        node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);

        // Получаем FileList
        node.addTechs([
            [bemTechs.levels, levels: ['blocks']],
            bemTechs.bemjsonToBemdecl,
            bemTechs.deps,
            bemTechs.files
        ]);

        // Собираем BEMHTML-файл
        node.addTech(BemhtmlTech);
        node.addTarget('?.bemhtml.js');

        // Создаем HTML-файл
        node.addTech(BemjsonToHtmlTech);
        node.addTarget('?.html');
    });
};
```

Работа с технологиями
---------------------

По БЭМ-методологии шаблоны к каждому блоку хранятся в отдельных файлах с расширением `.bemhtml.js` или `.bemtree.js` в директориях блоков. Чтобы использовать шаблоны, необходимо собрать их исходные файлы.

Отдельные файлы с шаблонами (`.bemhtml.js` или `.bemtree.js`) собираются в один общий файл (`?.bemhtml.js` или `?.bemtree.js`) с помощью одной из следующих технологий:

* [bemhtml](api.ru.md#bemhtml)
* [bemtree](api.ru.md#bemtree)

Результат — скомпилированный файл `?.bemhtml.js` или `?.bemtree.js` — может применяться по-разному в зависимости от наличия модульной системы и ее типа в следующих случаях:

* [в Node.js](#Исполнение-шаблонов-в-nodejs)
* [в браузере](#Исполнение-шаблонов-в-браузере)
* [для сборки HTML](#Использование-шаблонов-для-сборки-html)

### Исполнение шаблонов в Node.js

Скомпилированный файл подключается как модуль в формате [CommonJS](http://www.commonjs.org/).

```js
var BEMTREE = require('bundle.bemtree.js').BEMTREE, // Путь до скомпилированного BEMTREE-файла
    BEMHTML = require('bundle.bemhtml.js').BEMHTML; // Путь до скомпилированного BEMHTML-файла

BEMTREE.apply({ block: 'page', data: { /* ... */ } })
    .then(function (bemjson) {
        var html = BEMHTML.apply(bemjson);
    });
```

### Исполнение шаблонов в браузере

Скомпилированный файл подключается на страницу как JavaScript-файл.

```html
<script src="bundle.bemtree.js"></script>
<script src="bundle.bemhtml.js"></script>
```

В браузере способы исполнения шаблонов зависят от наличия модульной системы:

* **Без модульной системы**

  Шаблоны доступны из глобальной переменной `BEMHTML` или `BEMTREE`.

  ```js
  BEMTREE.apply({ block: 'page', data: { /* ... */ } })
      .then(function (bemjson) {
          var html = BEMHTML.apply(bemjson);
      });
  ```
* **С модульной системой YModules**

  Шаблоны доступны из модульной системы ([YModules](https://ru.bem.info/tools/bem/modules/)):

  ```js
  modules.require(['BEMTREE', 'BEMHTML'], function(BEMTREE, BEMHTML) {
      BEMTREE.apply({ block: 'page', data: { /* ... */ } })
          .then(function (bemjson) {
              var html = BEMHTML.apply(bemjson);
          });
  });
  ```

### Использование шаблонов для сборки HTML

HTML – результат применения скомпилированного шаблона к указанному [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/)-файлу.

Сборка HTML (файл `?.html`) с помощью технологий `enb-bemxjst` проходит в два этапа:

1. Файл `?.bemhtml.js` собирается с помощью технологии [bemhtml](api.ru.md#bemhtml).
2. BEMJSON и скомпилированный `?.bemhtml.js-файл` обрабатываются с помощью технологии [bemjson-to-html](#bemjson-to-html), которая возвращает HTML-файл (`?.html`).

Особенности работы пакета
-------------------------

### Подключение сторонних библиотек

Технологии [bemhtml](api.ru.md#bemhtml) и [bemtree](api.ru.md#bemtree) поддерживают возможность подключения сторонних библиотек как глобально, так и для разных модульных систем с помощью опции [requires](api.ru.md#requires).

Для подключения укажите название библиотеки и в зависимости от используемой модульной системы:

* имя глобальной переменной;
* имя модуля из YModules;
* путь к модулю для CommonJS.

```js
{
    requires: {
        'lib-name': {
            globals: 'libName',           // Название переменной в глобальной видимости
            ym: 'lib-name',               // Имя модуля из YModules
            commonJS: 'path/to/lib-name'  // Путь к модулю CommonJS относительно собираемого файла
        }
    }
}
```

В шаблонах модули будут доступны с помощью метода `this.require`, например:

```js
block('button').content()(function () {
    var lib = this.require('lib-name');

    return lib.hello();
});
```

Не обязательно указывать все модульные системы для подключения библиотеки.

Например, можно указать зависимости глобально. В этом случае модуль всегда будет передаваться из глобальной переменной, даже если в среде исполнения будет модульная система.

```js
{
    requires: {
        'lib-name': {
            globals: 'dependName' // Название переменной в глобальной видимости
        }
    }
}
```

**Пример подключения библиотеки `moment`**

Указывается путь к модулю:

```js
{
    requires: {
        moment: {
            commonJS: 'moment',  // Путь к модулю CommonJS относительно собираемого файла
        }
    }
}
```

В шаблонах модуль будет доступен с помощью метода `this.require('moment')`. Код шаблона пишется один раз, одинаково для исполнения в браузере и в `Node.js`:

```js
block('post').elem('data').content()(function () {
    var moment = this.require('moment'),  // Библиотека `moment`

    // Время в миллисекундах, полученное с сервера
    return moment(ctx.param.date).format('YYYY-MM-DD HH:mm:ss');
});
```

### Синтаксис

Существует два синтаксиса для шаблонов BEMHTML и BEMTREE:

* [JS-синтаксис](https://ru.bem.info/technology/bemhtml/current/bemhtml-js-syntax/)
* [сокращенный синтаксис](https://ru.bem.info/technology/bemhtml/current/reference/)

#### Какой выбрать?

С момента выпуска библиотеки [bem-core](https://ru.bem.info/libs/bem-core/) сокращенный синтаксис шаблонов считается устаревшим. Рекомендуется использовать JS-синтаксис для всех шаблонов.

О правилах перехода на JS-синтаксис читайте в [руководстве по миграции](https://ru.bem.info/technology/bemhtml/current/bemhtml-js-syntax/).

#### Поддержка сокращенного синтаксиса

Технологии [bemhtml](api.ru.md#bemhtml) и [bemtree](api.ru.md#bemtree) позволяют собирать шаблоны в сокращенном синтаксисе c помощью опции [compat](api.ru.md#compat).

Это может быть полезно при миграции c `bem-bl` на `bem-core`. Опция [compat](api.ru.md#compat) позволяет поэтапно переходить на JS-синтакис для каждого отдельного шаблона, а не переписывать код всего проекта целиком.

В процессе сборки шаблоны, написанные в сокращенном синтаксисе, приводятся к JS-синтаксису. Синтаксическое преобразование производит модуль [bemhtml-compat](https://github.com/bem/bemhtml-compat). Из-за транслирования сборка происходит медленнее даже для файлов в JS-синтаксисе.

Шаблоны в сокращенном синтаксисе следует хранить в файлах с расширениями `.bemhtml` и `.bemtree`, а не `.bemhtml.js` и `.bemtree.js`.

**Важно:** оба синтаксиса не могут использоваться одновременно в файле шаблона.

### Асинхронная шаблонизация

Технология [BEMTREE](https://ru.bem.info/technology/bemtree/current/bemtree/) работает асинхронно. Для обработки асинхронных вызовов используются промисы. Это означает, что после подключения скомпилированного BEMTREE-файла и вызова метода [BEMTREE.apply](https://ru.bem.info/technology/bemtree/v2/bemtree/#Входные-и-результирующие-данные-bemjson), который применит шаблоны к данным, вернется промис.

Для работы с промисами используется библиотека [vow](http://dfilatov.github.io/vow/) версии `0.4.10`.

**Важно:** технология [BEMHTML](https://ru.bem.info/technology/bemhtml/current/reference/) работает синхронно, асинхронная работа невозможна.

### Интернационализация

Базовая реализация BEM-XJST-технологий не содержит шаблонов для интернационализации (i18n).

Чтобы использовать i18n в шаблонах, следует подключить модуль `BEM.I18N` по аналогии с другими [сторонними библиотеками](#Подключение-сторонних-библиотек).

> `BEM.I18N` — библиотека для интернационализации блоков. Ядро находится в `keyset`-файлах в одной из базовых библиотек блоков:
* [bem-core](https://github.com/bem/bem-core/blob/v2/common.blocks/i-bem/__i18n/i-bem__i18n.i18n/core.js)
* [bem-bl](https://github.com/bem/bem-bl/blob/support/2.x/blocks-common/i-bem/__i18n/i-bem__i18n.i18n/core.js)

После подключения `BEM.I18N` библиотека будет доступна в шаблонах с помощью метода `this.require`:

```js
block('button').elem('tooltip').content()(function () {
    var i18n = this.require('i18n'),  // Библиотека `BEM.I18N`

    // Локализованное значение для ключа `tooltip`
    return i18n('button', 'tooltip');
});
```

Дополнительная документация
---------------------------

* [API технологий](api.ru.md)
* [Быстрый старт по BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/)
* [Описание шаблонизатора и его преимуществ](https://ru.bem.info/technology/bemhtml/current/rationale/)
* [Справочное руководство по шаблонизатору BEMHTML](https://ru.bem.info/technology/bemhtml/current/reference/)
* [Справочное руководство по шаблонизатору BEMTREE](https://ru.bem.info/technology/bemtree/current/bemtree/)
* [Справочное руководство по BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/)
* [Шаблонизация данных](https://ru.bem.info/technology/bemhtml/current/templating/)
* [JS-синтаксис](https://ru.bem.info/technology/bemhtml/current/bemhtml-js-syntax/)

Лицензия
--------

© 2013 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
