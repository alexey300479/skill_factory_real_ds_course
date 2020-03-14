# -*- coding: utf-8 -*-
# Испортируем необходимые библиотеки
import pandas as pd
import scrapy as sc

# Создаем класс TASpider на основе scrapy.Spider
class TASpider(sc.Spider):

    # Задаем его имя
    name = 'ta_spider'

    # Создаем функцию, возвращающую полный URL по частичному URL_TA из датафреймов
    def get_full_url(self, url_ta):
        return self.BASE_TA_URL + url_ta

    def __init__(self):

        # Задаем базовый URL
        self.BASE_TA_URL = 'https://www.tripadvisor.com'

        # Создаем датафреймы по старым датасетам
        self.mt_df = pd.read_csv('main_task.csv')
        self.kt_df = pd.read_csv('kaggle_task.csv')

        # ------ Начало кода, дающего возможность продолжить сбор данных с того места, где ранее остановились ------
        # Создаем множество URL_TA из датасета main_task.csv
        self.mt_urls = set(self.mt_df['URL_TA'])

        # Создаем множество URL_TA из датасета kaggle_task.csv
        self.kt_urls = set(self.kt_df['URL_TA'])

        # Пробуем открыть датасет со свежими данными
        try:
            self.fresh_data = pd.read_csv('fresh_data.csv')
        except:
            # Если не удалось, продолжаем так
            print('Start primary data scrapping...')
        else:
            # А если удалось, то есть датасет с новыми данными был ранее сформирован (частично или полностью),
            # то удаляем из множества urls обработанные ранее URL_TA
            self.processed_urls = set(self.fresh_data['URL_TA'])
            self.urls = self.mt_urls.union(self.kt_urls) - self.processed_urls
            print('Continue data scrapping...')
        # ------ Конец кода, дающего возможность продолжить сбор данных с того места, где ранее остановились ------

        # Устанавливаем счетчик прогресса текущей сессии на 0
        self.progress = 0
        # Определяем максимальное количество
        self.max_progress = len(self.urls)

        # Определяем пути к нужным данным (определение самих путей и тесты заняли самое большое время в разработке)
        self.cuisine_css_path = '.restaurants-detail-overview-cards-DetailsSectionOverviewCard__tagText--1OH6h::text'
        self.alt_cuisine_xpath = '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div/div/div[2]/div[2]/div[2]/text()'

        self.xpaths = {
            'Name': '/html/body/div[2]/div[1]/div/div[4]/div/div[1]/h1/text()',
            'City': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/span/a/text()',
            'Cuisine Style': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div/div/div/div[1]/div[1]/text()',
            'Ranking': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/span/b/span/text()',
            'Restaurants Count': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/span/text()',
            'Rating': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/span[1]/text()',
            'Price Range': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[3]/div/a[1]/text()',
            'Number of Reviews': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/a/text()'
        }

    # Определяем стандартный метод, вызываемый в самом начале работы по сбору данных
    def start_requests(self):
        # Для всех оставшихся URL_TA
        for url in self.urls:
            # Осуществляем запрос к сайту TripAdvisor и накапливаем результаты парсинга
            yield sc.Request(url=self.get_full_url(url), callback=self.parse)

    # Определяем метод, который будет парсить полученную по запросу страницу и заполнять соответствующие данные
    def parse(self, response):
        # Создаем пустой словарь для данных по ресторану
        restaurant = dict()

        # Получаем название ресторана
        restaurant['NewName'] = response.xpath(self.xpaths['Name']).get()
        
        # Пытаемся получить название города
        try:
            restaurant['NewCity'] = response.xpath(self.xpaths['City']).get()[15:]
        except:
            # В исключительной ситуации ставим значение None
            restaurant['NewCity'] = None
       
        # Получаем стили кухни
        cuisine_style = response.xpath(self.xpaths['Cuisine Style']).get()
        # Если нашли что-то не то, ищем в других местах
        if cuisine_style == 'CUISINES':
            cuisine_style = response.css(self.cuisine_css_path).get()
        elif cuisine_style == 'PRICE RANGE':
            cuisine_style = response.xpath(self.alt_cuisine_xpath).get()
        restaurant['New Cuisine Style'] = cuisine_style

        # Пробуем получить ранг
        try:
            restaurant['New Ranking'] = int(response.xpath(self.xpaths['Ranking']).get().replace('#', '').replace(',', ''))
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Ranking'] = None

        # Пробуем получить общее количество ресторанов в городе
        try:
            restaurant['New Restaurants Count'] = int(response.xpath(self.xpaths['Restaurants Count']).get().split(' ')[-2].replace(',', ''))
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Restaurants Count'] = None

        # Пробуем вычислить нормализованное значение ранга
        try:
            restaurant['New Ranking Normalized'] = restaurant['New Ranking'] / restaurant['New Restaurants Count']
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Ranking Normalized'] = None

        # Пробуем получить значение рейтинга
        try:
            restaurant['New Rating'] = float(response.xpath(self.xpaths['Rating']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Rating'] = None
        
        # Получаем диапазон цен
        price_range = response.xpath(self.xpaths['Price Range']).get()
        
        # Пробуем получить значение диапазона цен
        try:
            # Если полученное значение не содержит знак '$'
            if price_range.find('$') == -1:
                # То это значит, что ресторан новый и для него еще нет данных по диапазону цен
                # Ставим минимальный диапазон цен
                price_range = '$'
            restaurant['New Price Range'] = price_range
        except:
            restaurant['New Price Range'] = None
        
        # Пробуем получить количество отзывов
        try:
            restaurant['New Number of Reviews'] = int(response.xpath(self.xpaths['Number of Reviews']).get().split()[0])
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Number of Reviews'] = None
    
        # Записываем URL_TA для дальнейшего сопоставления старого и нового датасетов
        restaurant['URL_TA'] = response.url[len(self.BASE_TA_URL):]

        # Отслеживаем прогресс и выводим информацию
        self.progress += 1
        print(f'Completed {self.progress} of {self.max_progress} data scraping steps. Prorgess: {self.progress / self.max_progress:.2%}...')

        # Возвращаем результат парсинга
        return restaurant
