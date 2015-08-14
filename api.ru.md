# API технологий

Пакет предоставляет следующие технологии:

* для сборки шаблонов: [bemhtml](#bemhtml) и [bemtree](#bemtree);
* для генерации HTML: [bemjson-to-html](#bemjson-to-html).

## bemhtml

Собирает `bemhtml.js`-файлы блоков в один файл — `?.bemhtml.js`-бандл, который используется для работы как в браузере, так и в `Node.js`. Не требует подключения исходных файлов шаблонов.

Поддерживает [YModules](https://ru.bem.info/tools/bem/modules/) и частично [CommonJS](http://www.commonjs.org/), так как в `bemhtml.js`-файлах функция `require` не будет работать корректно.

Если в исполняемой среде нет ни одной модульной системы, то модуль будет предоставлен в глобальную переменную `BEMHTML`.

### Опции

Опции указываются в конфигурационном файле (`.enb/make.js`).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [compat](#compat)
* [devMode](#devmode)
* [requires](#requires)
* [exportName](#exportname)

### target

Тип: `String`. По умолчанию: `?.bemhtml.js`.

Имя скомпилированного файла, куда будет записан результат сборки необходимых `bemhtml.js`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://ru.bem.info/tools/bem/enb-bem-techs/readme/#files) пакета [enb-bem-techs](https://ru.bem.info/tools/bem/enb-bem-techs/readme/).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bemhtml.js', 'bemhtml']`.

Суффиксы файлов, по которым отбираются файлы BEMHTML-шаблонов для дальнейшей сборки.

#### compat

Тип: `Boolean`. По умолчанию: `false`.

Включает поддержку [сокращенного синтаксиса](https://ru.bem.info/technology/bemhtml/current/reference/) для шаблонов BEMHTML.

> Принцип работы описан в разделе [Поддержка сокращенного синтаксиса](README.md#Поддержка-сокращенного-синтаксиса).

#### devMode

Тип: `Boolean`. По умолчанию: `true`.

Включает режим сборки для дальнейшей отладки. Код шаблонов не будет скомпилирован, а только обернут специальным BEM-XJST-кодом, включающим ядро BEM-XJST.

#### requires

Тип: `Object`. По умолчанию: `{}`.

Задает имена или пути для подключения сторонних библиотек.

> Принцип работы описан в разделе [Подключение сторонних библиотек](README.md#Подключение-сторонних-библиотек).

#### exportName

Тип: `String`. По умолчанию: `BEMHTML`.

Название, по которому будет доступен BEMHTML-модуль. Способы использования зависят от наличия модульной системы и ее типа. Модуль может применяться в следующих случаях:

* Исполнение шаблонов в `Node.js`.

  ```js
  var BEMHTML = require('bundle.bemhtml.js').BEMHTML;

  var html = BEMHTML.apply({ block: 'button' });
  ```

* Исполнение шаблонов в браузере без модульной системы.

  ```js
  var html = BEMHTML.apply({ block: 'button' });
  ```

* Исполнение шаблонов в браузере c [YModules](https://ru.bem.info/tools/bem/modules/).

  ```js
  modules.require(['BEMHTML'], function(BEMHTML) {
      var html = BEMHTML.apply({ block: 'button' });
  });
  ```

--------------------------------------

**Пример**

```js
var BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
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

         // Создаем BEMHTML-файл
         node.addTech(BemhtmlTech);
         node.addTarget('?.bemhtml.js');
     });
 };
```

## bemtree

Собирает `bemtree.js`-файлы блоков в один файл — `?.bemtree.js`-бандл, который используется для работы как как в браузере, так и в `Node.js`. Не требует подключения исходных файлов шаблонов.

Поддерживает [YModules](https://ru.bem.info/tools/bem/modules/) и частично [CommonJS](http://www.commonjs.org/), так как в `bemtree.js`-файлах функция `require` не будет работать корректно.

Если в исполняемой среде нет ни одной модульной системы, то модуль будет предоставлен в глобальную переменную `BEMTREE`.

### Опции

Опции указываются в конфигурационном файле (`.enb/make.js`).

* [target](#target-1)
* [filesTarget](#filestarget-1)
* [sourceSuffixes](#sourcesuffixes-1)
* [compat](#compat-1)
* [devMode](#devmode-1)
* [requires](#requires-1)
* [exportName](#exportname-1)
* [includeVow](#includevow)

### target

Тип: `String`. По умолчанию: `?.bemtree.js`.

Имя скомпилированного файла, куда будет записан результат сборки необходимых `bemtree.js`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://ru.bem.info/tools/bem/enb-bem-techs/readme/#files) пакета [enb-bem-techs](https://ru.bem.info/tools/bem/enb-bem-techs/readme/).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bemtree.js', 'bemtree']`.

Суффиксы файлов, по которым отбираются файлы BEMHTML-шаблонов для дальнейшей сборки.

#### compat

Тип: `Boolean`. По умолчанию: `false`.

Включает поддержку [сокращенного синтаксиса](https://ru.bem.info/technology/bemhtml/current/reference/) для шаблонов BEMTREE.

> Принцип работы описан в разделе [Поддержка сокращенного синтаксиса](README.md#Поддержка-сокращенного-синтаксиса).

#### devMode

Тип: `Boolean`. По умолчанию: `true`.

Включает режим сборки для дальнейшей отладки. Код шаблонов не будет скомпилирован, а только обернут специальным BEM-XJST-кодом, включающим ядро BEM-XJST.

#### requires

Тип: `Object`. По умолчанию: `{}`.

Задает имена или пути для подключения сторонних библиотек.

> Принцип работы описан в разделе [Подключение сторонних библиотек](README.md#Подключение-сторонних-библиотек).

#### exportName

Тип: `String`. По умолчанию: `BEMHTML`.

Название, по которому будет доступен BEMHTML-модуль. Способы использования зависят от наличия модульной системы и ее типа. Модуль может применяться в следующих случаях:

* Исполнение шаблонов в `Node.js`.

  ```js
  var BEMTREE = require('bundle.bemtree.js').BEMTREE;

  BEMTREE.apply({ block: 'page' })
      .then(function (bemjson) { /* ... */ });
  ```

* Исполнение шаблонов в браузере без модульной системы.

  ```js
  BEMTREE.apply({ block: 'page' })
    .then(function (bemjson) { /* ... */ });
  ```

* Исполнение шаблонов в браузере c [YModules](https://ru.bem.info/tools/bem/modules/).

  ```js
  modules.require(['BEMTREE'], function(BEMTREE) {
      BEMTREE.apply({ block: 'page' })
          .then(function (bemjson) { /* ... */ });
  });
  ```

#### includeVow

Тип: `Boolean`. По умолчанию: `true`.

Добавляет код модуля [vow](http://dfilatov.github.io/vow/) версии `0.4.10` в скомпилированный файл.

> Причины использования модуля `vow` описаны в разделе [Асинхронная шаблонизация](README.md#Асинхронная-шаблонизация).

--------------------------------------

**Пример**

```js
var BemtreeTech = require('enb-bemxjst/techs/bemtree'),
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
     });
 };
```

## bemjson-to-html

Предназначен для сборки HTML-файла. Принимает на вход [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/) и скомпилированный `?.bemhtml.js`-файл (результат работы технологий [bemhtml](#bemhtml)), возвращает HTML (файл `?.html`).

### Опции

Опции указываются в конфигурационном файле (`.enb/make.js`).

* [target](#target-2)
* [bemhtmlFile](#bemhtmlfile)
* [bemjsonFile](#bemjsonfile)

#### target

Тип: `String`. По умолчанию: `?.html`.

HTML-файл — результат применения скомпилированных шаблонов к указанному BEMJSON-файлу.

#### bemhtmlFile

Тип: `String`. По умолчанию: `?.bemhtml.js`.

Имя файла, в котором содержатся шаблоны, скомпилированные технологией [bemhtml](#bemhtml). Используется для преобразования BEMJSON в HTML.

#### bemjsonFile

Тип: `String`. По умолчанию: `?.bemjson.js`.

Имя BEMJSON-файла, к которому применится скомпилированный шаблон `?.bemhtml.js` (результат работы технологии [bemhtml](#bemhtml)) для получения HTML.

---------------------------------

**Пример**

```js
var BemjsonToHtmlTech = require('enb-bemxjst/techs/bemjson-to-html'),
    BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получает BEMJSON-файл
        node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);

        // Получает FileList
        node.addTechs([
            [bemTechs.levels, levels: ['blocks']],
            bemTechs.bemjsonToBemdecl,
            bemTechs.deps,
            bemTechs.files
        ]);

        // Собирает BEMHTML-файл
        node.addTech(BemhtmlTech);
        node.addTarget('?.bemhtml.js');

        // Создает HTML-файл
        node.addTech(BemjsonToHtmlTech);
        node.addTarget('?.html');
    });
};
```
