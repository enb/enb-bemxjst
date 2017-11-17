# API технологий

Пакет предоставляет следующие технологии:

* [bemhtml](#bemhtml) — для сборки шаблонов;
* [bemtree](#bemtree) — для сборки шаблонов;
* [bemjson-to-html](#bemjson-to-html) — для генерации HTML.

## bemhtml

Собирает `bemhtml.js`-файлы блоков в один файл — `?.bemhtml.js`-бандл, который используется для работы как в браузере, так и в Node.js. Не требует подключения исходных файлов шаблонов.

Поддерживает [YModules](https://github.com/ymaps/modules/blob/master/README.ru.md) и частично [CommonJS](http://www.commonjs.org), так как в `bemhtml.js`-файлах функция `require` не будет работать корректно.

Если в исполняемой среде нет ни одной модульной системы, то модуль будет предоставлен в глобальную переменную `BEMHTML`.

### Опции

Опции указываются в конфигурационном файле (`.enb/make.js`).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [requires](#requires)
* [exportName](#exportname)
* [forceBaseTemplates](#forcebasetemplates)
* [engineOptions](#engineoptions)
* [naming](#naming)

### target

Тип: `String`. По умолчанию: `?.bemhtml.js`.

Имя скомпилированного файла, куда будет записан результат сборки необходимых `bemhtml.js`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bemhtml.js']`.

Суффиксы файлов, по которым отбираются файлы BEMHTML-шаблонов для дальнейшей сборки.

#### requires

Устарело! Используйте `engineOptions.requires`.

Тип: `Object`. По умолчанию: `undefined`.

Задает имена или пути для подключения сторонних библиотек.

> Принцип работы описан в разделе [Подключение сторонних библиотек](README.md#Подключение-сторонних-библиотек).

#### exportName

Тип: `String`. По умолчанию: `BEMHTML`.

Название, по которому будет доступен BEMHTML-модуль. Способы использования зависят от наличия модульной системы и ее типа. Модуль может применяться в следующих случаях:

* Исполнение шаблонов в Node.js.

  ```js
  var BEMHTML = require('bundle.bemhtml.js').BEMHTML;

  BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  ```

* Исполнение шаблонов в браузере без модульной системы.

  ```js
  BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  ```

* Исполнение шаблонов в браузере c [YModules](https://github.com/ymaps/modules/blob/master/README.ru.md).

  ```js
  modules.require(['BEMHTML'], function(BEMHTML) {
      BEMHTML.apply({ block: 'button' }); // <button class="button">...</button>
  });
  ```

#### forceBaseTemplates

Тип: `Boolean`. По умолчанию `false`.

Включать ли ядро в сборку, если нет пользовательских шаблонов.

По умолчанию, если пользовательских шаблонов нет, то и код ядра `bem-xjst` также не будет включен в сборку.

#### engineOptions

Тип: `Object`. По умолчанию `{}`.

Передает [настройки](https://github.com/bem/bem-xjst/blob/master/docs/ru/3-api.md#Настройки) BEMHTML-движка для `bem-xjst`.

#### naming

Устарело! Используйте `engineOptions.naming`.

Тип: `Object`. По умолчанию: `{ elem: '__', mod: '_' }`.

Соглашение об именовании БЭМ-сущностей для генерации CSS-классов:

* **String** `elem` — отделяет имя элемента от блока.
* **String** `mod` — отделяет названия и значения модификаторов от блоков и элементов.

**Пример**

```js
{
    block : 'button',
    mods : { disabled : true },
    content : 'Неактивна'
}
```

По умолчанию CSS-классы будут сгенерированы согласно оригинальному соглашению об именовании БЭМ-сущностей.

```html
<button class="button button_disabled">Неактивна</button>
```

Чтобы использовать [стиль Two Dashes](https://github.com/bem-sdk-archive/bem-naming#two-dashes-style) укажите `--` в качестве разделителя для модификатора.

```js
naming: { elem: '__', mod: '--' }
```

В результате получится следующий HTML-код:

```html
<button class="button button--disabled">Неактивна</button>
```

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
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Создаем BEMHTML-файл
         node.addTech(BemhtmlTech);
         node.addTarget('?.bemhtml.js');
     });
 };
```

## bemtree

Собирает `bemtree.js`-файлы блоков в один файл — `?.bemtree.js`-бандл, который используется для работы как в браузере, так и в `Node.js`. Не требует подключения исходных файлов шаблонов.

Поддерживает [YModules](https://github.com/ymaps/modules/blob/master/README.ru.md) и частично [CommonJS](http://www.commonjs.org/), так как в `bemhtml.js`-файлах функция `require` не будет работать корректно.

Если в исполняемой среде нет ни одной модульной системы, то модуль будет предоставлен в глобальную переменную `BEMTREE`.

### Опции

Опции указываются в конфигурационном файле (`.enb/make.js`).

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [requires](#requires)
* [exportName](#exportname)
* [forceBaseTemplates](#forceBaseTemplates)
* [engineOptions](#engineoptions-1)

### target

Тип: `String`. По умолчанию: `?.bemtree.js`.

Имя скомпилированного файла, куда будет записан результат сборки необходимых `bemtree.js`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.ru.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['bemtree.js']`.

Суффиксы файлов, по которым отбираются файлы BEMHTML-шаблонов для дальнейшей сборки.

#### requires

Устарело! Используйте `engineOptions.requires`.

Тип: `Object`. По умолчанию: `undefined`.

Задает имена или пути для подключения сторонних библиотек.

> Принцип работы описан в разделе [Подключение сторонних библиотек](README.md#Подключение-сторонних-библиотек).

#### exportName

Тип: `String`. По умолчанию: `BEMTREE`.

Название, по которому будет доступен BEMTREE-модуль. Способы использования зависят от наличия модульной системы и ее типа. Модуль может применяться в следующих случаях:

* Исполнение шаблонов в Node.js.

  ```js
  var BEMTREE = require('bundle.bemtree.js').BEMTREE;

  BEMTREE.apply({ block: 'page' }); // { block: 'page', content: [...] }
  ```

* Исполнение шаблонов в браузере без модульной системы.

  ```js
  BEMTREE.apply({ block: 'page' }); // { block: 'page', content: [...] }
  ```

* Исполнение шаблонов в браузере c [YModules](https://github.com/ymaps/modules/blob/master/README.ru.md).

  ```js
  modules.require(['BEMTREE'], function(BEMTREE) {
      BEMTREE.apply({ block: 'button' }); // { block: 'page', content: [...] }
  });
  ```

#### forceBaseTemplates

Тип: `Boolean`. По умолчанию `false`.

Включать ли ядро в сборку, если нет пользовательских шаблонов.

По умолчанию, если пользовательских шаблонов нет, то и код ядра `bem-xjst` также не будет включен в сборку.

#### engineOptions

Тип: `Object`. По умолчанию `{}`.

Передает [настройки](https://github.com/bem/bem-xjst/blob/master/docs/ru/3-api.md#Настройки) BEMTREE-движка для `bem-xjst`.

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
             [bemTechs.levels, { levels: ['blocks'] }],
             [bemTechs.deps],
             [bemTechs.files]
         ]);

         // Создаем BEMTREE-файл
         node.addTech(BemtreeTech);
         node.addTarget('?.bemtree.js');
     });
 };
```

## bemjson-to-html

Предназначен для сборки HTML-файла. Принимает на вход [BEMJSON](https://ru.bem.info/platform/bemjson/) и скомпилированный `?.bemhtml.js`-файл (результат работы технологий [bemhtml](#bemhtml)), возвращает HTML (файл `?.html`).

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
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.bemjsonToBemdecl],
            [bemTechs.deps],
            [bemTechs.files]
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
