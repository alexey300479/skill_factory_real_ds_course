AUTHOR: Alexey Kiselev (aka alexey300479). Email: alexey300479@yandex.ru Russia, Tula, Feb. 2020

RU
Введение.

Проект ta_scrapy создан в рамках решения задач соревнования [SF-DST] Restaurant Rating prediction, доступного по ссылке
https://www.kaggle.com/t/18c4256240c04280890e771864c63173, основан на использовании библиотеки Scrapy и предназначен для
сбора новых данных с сайта https://www.tripadvisor.com по адресам страниц ресторанов URL_TA, приведенных в датасетах
main_task.csv и kaggle_task.csv этого соревнования (прилагаются).

Подготовка к использованию:
1. Установите Scrapy одним из следующих способов:
--- CONDA ---

conda install scrapy

--- PIP ---

pip install scrapy

2. Откройте терминал и перейдите в директорию проекта (ту самую, в которой лежат файлы main_task.csv, kaggle_task.csv и
fresh_data.csv) 
3. Если нужны самые свежие данные, то переместите в другую директорию или удалите файл fresh_data.csv
4. Запустите процесс сбора данных при помощи следующей команды:

scrapy crawl ta_spider -o fresh_data.csv --nolog

5. Наслаждайтесь процессом и главное результатом.

EN
Intro.

ta_scrapy project was created in bounds of solving problems of [SF-DST] Restaurant Rating prediction Kaggle competition,
available here https://www.kaggle.com/t/18c4256240c04280890e771864c63173. It is based on using Scrapy package and designed
to collect new data from https://www.tripadvisor.com by URL_TA urls wich are given in main_task.csv and kaggle_task.csv
datasets are attached.

Preparing:
1. Install Scrapy using one of folowing ways:
--- CONDA ---

conda install scrapy

--- PIP ---

pip install scrapy

2. Open terminal and go to the project folder (the one in which the main_task.csv, kaggle_task.csv and
fresh_data.csv are). 
3. If you need most fresh data, then move to another folder or delete file fresh_data.csv
4. Start the data collection process with the following command:

scrapy crawl ta_spider -o fresh_data.csv --nolog

5. Enjoy the process and most importantly enjoy the result.