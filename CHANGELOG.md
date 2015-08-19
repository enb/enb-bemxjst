История изменений
=================

2.0.0
-----

**Требования:** версия [bem-core](https://github.com/bem/bem-core/) не ниже `2.7.0`.

### Новая функциональность

* [Подключение сторонних библиотек](README.md#Подключение-сторонних-библиотек) c помощью опции [requires](api.ru.md#requires) ([#61]).

### Крупные изменения

* [ __*major*__ ] Удалена поддержка файлов с расширением `.bemhtml.xjst` ([#50]).
* Добавлена поддержка файлов с расширением `.bemhtml.js` ([#51], [#90]).
* При сборке BEMTREE-шаблонов в результирующий код [добавляется](README.md#Асинхронная-шаблонизация) код модуля [vow](http://dfilatov.github.io/vow/) ([#33]). Настраивается с помощью опции [includeVow](api.ru.md#includevow).
* Для случаев, когда шаблоны отсутствуют, результатом сборки является заглушка без BEM-XJST-кода ([#47]).
* Если в сборку не попали базовые шаблоны (например, не указана зависимость), то при выполнении методов `BEMHTML.apply()` и `BEMTREE.apply()` будет генерироваться соответствующее сообщение об ошибке ([#60]).

### Технологии

* [ __*major*__ ] Технологии `bemhtml` и `bemhtml-old` объединены в одну — [bemhtml](api.ru.md#bemhtml) ([#25]).
* [ __*major*__ ] Технологии `bemtree` и `bemtree-old` объединены в одну — [bemtree](api.ru.md#bemtree) ([#25]).
* [ __*major*__ ] Технология `html-from-bemjson` переименована в [bemjson-to-html](api.ru.md#bemjson-to-html) ([#41]).
* [ __*major*__ ] Технология `html-from-bemjson-i18n` удалена. Для работы с локализацией нужно использовать технологии из пакета `enb-bem-i18n` ([#42]).

#### Опции технологий

* [ __*major*__ ] Из технологии `bemjson-to-html` удалены устаревшие опции: `destTarget`, `bemjsonTarget` и `bemhtmlTarget`. Вместо них следует использовать `target`, `bemjsonFile` и `bemhtmlFile`, соответственно. ([#58]).
* [ __*major*__ ] Из технологий [bemhtml](api.ru.md#bemhtml) удалена опция `cache` ([#88]).

### Зависимости

* Модуль `bem-xjst@1.0.3` обновлен до версии `1.2.1` ([#37], [#80]).

1.3.5
-----

**Требования:** версия [bem-core](https://github.com/bem/bem-core/) не ниже `2.4.0`.

* Модуль `bem-xjst` обновлен до версии `1.0.3`.
* Модуль `vow` обновлен до версии `0.4.10`.

1.3.4
-----

**Требования:** версия [bem-core](https://github.com/bem/bem-core/) не ниже `2.4.0`.

* Исправлен кэш для технологии `html-from-bemjson-i18n`.
* Модуль `vow` обновлен до версии `0.4.7`.

1.3.3
-----

**Требования:** версия [bem-core](https://github.com/bem/bem-core/) не ниже `2.4.0`.

* `vow` обновлен до версии `0.4.6`.
* `bem-xjst` обновлен до версии `0.9.0`.
* `bemhtml-compat` обновлен до версии `0.1.2`.

1.3.2
-----

**Требования:** версия [bem-core](https://github.com/bem/bem-core/) не ниже `2.4.0`.

* `bem-xjst` обновлен до версии `0.8.3`.

1.3.1 (сломана)
-----

* `vow` модуль не прокидывается по умолчанию в `YModules` для `bemtree` и `bemtree-old` технологий.
* `bem-xjst` обновлен до версии `0.8.2` (версия содержит ошибки).

1.3.0 (сломана)
-----

* Опция `modulesDeps` добавлена ко всем технологиям.
* `vow` обновлен до версии `0.4.5`.
* `bem-xjst` обновлен до версии `0.8.0` (версия содержит ошибки).

1.2.0
-----

* Добавлена `html-from-bemjson` технология.
* Добавлена `html-from-bemjson-i18n` технология.

1.1.1
-----

* `vow` обновлен до версии `0.4.3`.

1.1.0
-----

* Опция `devMode` больше не зависит от `YENV` и включена по умолчанию.
* `vow` обновлен до версии `0.4.1`.
* `sibling` обновлен до версии `0.1.3`.

1.0.0
-----

* Опция `cache` для `bemhtml` технологий теперь отключена по умолчанию.

0.2.2
-----

* `bem-xjst` обновлен до версии `0.4.0`.

0.2.1
-----

* Опция `devMode` исправлена.
* Опция `cache` исправлена.

0.2.0
-----

* Для транслирования кода используется `bem-xjst`, вместо `bemhtml` библиотеки, входящей в `bem-core`.
* `vow` обновлен до версии `0.3.12`.
* `bemhtml-compat` обновлен до версии `0.0.11`.

0.1.1
-----

* Добавлена технология `bemtree-old`.
* `vow` обновлен до версии `0.3.10`.

0.1.0
-----

* Добавлена технология `bemtree`.
* `vow-fs` больше не используется.
* `bemhtml-compat` обновлен до версии `0.0.10`.

0.0.6
-----

* При сборке bemhtml технологий надпись 'Calm down, OmetaJS is running...' больше не показывается.
* `bemhtml-compat` обновлен до версии `0.0.9`.

0.0.5
-----

* Опция `devMode` по умолчанию теперь зависит от `YENV`.

0.0.4
-----

* Зависимость от `enb@0.8.22`, переход на общий инстанс `vow-fs`.

0.0.3
-----

* Исправлен баг сборки `bemhtml`-файлов в новом js-стиле, не имеющих `.xjst` расширения, `bemhtml-old` технологией.

0.0.2
-----

* Добавлена технология `bemhtml-old`.

0.0.1
-----

* Добавлена технология `bemhtml`.

[#90]: https://github.com/enb-bem/enb-bh/issues/90
[#88]: https://github.com/enb-bem/enb-bh/issues/88
[#80]: https://github.com/enb-bem/enb-bh/issues/80
[#61]: https://github.com/enb-bem/enb-bh/issues/61
[#60]: https://github.com/enb-bem/enb-bh/issues/60
[#58]: https://github.com/enb-bem/enb-bh/issues/58
[#51]: https://github.com/enb-bem/enb-bh/issues/51
[#50]: https://github.com/enb-bem/enb-bh/issues/50
[#47]: https://github.com/enb-bem/enb-bh/issues/47
[#42]: https://github.com/enb-bem/enb-bh/issues/42
[#41]: https://github.com/enb-bem/enb-bh/issues/41
[#33]: https://github.com/enb-bem/enb-bh/issues/33
[#37]: https://github.com/enb-bem/enb-bh/issues/37
[#25]: https://github.com/enb-bem/enb-bh/issues/25
