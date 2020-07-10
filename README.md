## Инструкция как деплоить

Устанавливаем python-software-properties, если нет

### `sudo apt install python-software-properties`

Устанавливаем npm и nodejs, если нет

### `sudo apt install nodejs`

Устанавливаем postgres, если нет

### `sudo apt install postgresql postgresql-contrib`

Создаем базу и пользователя

### `sudo -u postgres psql`

### `create database fishshop`

### `create user fishshop with password password`

### `grant all privileges on database fishshop to user fishshop`

Внутри проекта в core создаем файл local_settings.py по образу и подобию local_settings_example.py
Там прописываем настройки базы

Из корня проекта переходим в директорию frontend

Ставим библиотеки

### `npm install`

Компилируем

### `npm run build`

Переходим в корень проекта и создаем там виртуальное окружение python

### `python3 -m venv .`

Активируем виртуальное окружение

### `source venv/bin/activate`

Устанавливаем библиотеки

### `pip install -r requirements.txt`

Проводим миграции

### `python manage.py makemigrations`

### `python manage.py migrate`

Стартуем

### `python manage.py runsever 0.0.0.0:8000`