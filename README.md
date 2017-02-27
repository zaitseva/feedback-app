# Локальная разработка

## Необходимые приложения:

* http://nodejs.org/						node.js
* http://www.npmjs.com/						npm
* https://www.ruby-lang.org/en/downloads/	ruby
* http://sass-lang.com/install				sass
* https://www.python.org/downloads/			python	версии 2.7 (для windows это важно)
* http://gruntjs.com						grunt.js (npm install -g grunt-cli)

## Первый запуск:

* Клонировать репозиторий
* В консоли, находясь в рабочей папке, выполнить команду npm i
* Запустить сборщик для разработки командой: grunt    
После первого запуска добавится папка dist и верстка соберется из исходных кодов.    
Сервер с версткой будет запущен по адресу: http://127.0.0.1:8000/    
Приложение будет доступно по адресу http://127.0.0.1:8000/feedback/
* Для полной сборки использовать команду: grunt build
* Для проверки полной сборки использовать команду: grunt serve (включает такси build и server)

## Подготовка к сборке, сборка

* обновить файл ./version.txt - указать номер собираемой версии
* закоммитить и запушить
* добавить тег/версию и запушить его

## [Документация по проекту](https://gitlab.notamedia.ru/mos-docs/docs/tree/master/front/markup/feedback)