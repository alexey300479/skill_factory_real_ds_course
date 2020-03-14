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

        # Загружаем старые датасеты в соответствующие датафреймы
        self.mt_df = pd.read_csv('main_task.csv')
        self.kt_df = pd.read_csv('kaggle_task.csv')

        # ------ Начало кода, дающего возможность продолжить сбор данных с того места, где ранее остановились ------
        # Создаем список, в который будем вносить все URL из старых датасетов с контролем уникальности
        all_urls = list()

        # Создаем список, который будет содержать все URL подлежащие обработке
        self.urls = list()

        # Создаем список, который будет содержать все обработанные URL
        self.processed_urls = list()

        # Создаем список URL из датасета main_task.csv
        self.mt_urls = list(self.mt_df['URL_TA'])
        # И добавляем их в список всех URL с контролем уникальности
        for url in self.mt_urls:
            if not url in all_urls:
                all_urls.append(url)
        
        # Создаем множество URL_TA из датасета kaggle_task.csv
        self.kt_urls = list(self.kt_df['URL_TA'])
        # И добавляем их в список всех URL с контролем уникальности
        for url in self.kt_urls:
            if not url in all_urls:
                all_urls.append(url)

        # Пробуем открыть датасет со свежими данными
        try:
            self.fresh_data = pd.read_csv('fresh_data.csv')
        except:
            # Если не удалось, то считаем, что мы только начали парсинг и
            # работаем по всем URL из main_task.csv и kaggle_task.csv
            self.urls = all_urls
            print('Start primary data scrapping...')
        else:
            # А если удалось, то есть датасет с новыми данными был ранее сформирован
            # частично или полностью, то в список self.urls добавляем только те url
            # из all_urls, которые не присутствуют в списке URL нового датасета
            self.processed_urls = list(self.fresh_data['URL_TA'])
            for url in all_urls:
                if not url in self.processed_urls:
                    self.urls.append(url)
            
            print(f'{len(self.processed_urls)} URLs was processed early. Continue data scrapping...')
        
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
            'City_2': '/html/body/div[2]/div[1]/div/div[4]/div/div[4]/div[1]/div/div/div[1]/span[2]/span[2]/text()',
            'Cuisine Style': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[2]/div/div/div/div[1]/div[1]/text()',
            'Ranking': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/span/b/span/text()',
            'Restaurants Count': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/span/text()',
            'Rating': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/span[1]/text()',
            'Price Range': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[3]/div/a[1]/text()',
            'Price Range_2': '/html/body/div[2]/div[1]/div/div[4]/div/div[3]/div[2]/div/a[1]/text()',
            'Number of Reviews': '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/a/text()',
            'Excellent Marks': '/html/body/div[2]/div[2]/div[2]/div[6]/div/div[1]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/div/div[2]/div/div[1]/span[2]/text()',
            'Very Good Marks': '/html/body/div[2]/div[2]/div[2]/div[6]/div/div[1]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/div/div[2]/div/div[2]/span[2]/text()',
            'Average Marks': '/html/body/div[2]/div[2]/div[2]/div[6]/div/div[1]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/div/div[2]/div/div[3]/span[2]/text()',
            'Poor Marks': '/html/body/div[2]/div[2]/div[2]/div[6]/div/div[1]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/div/div[2]/div/div[4]/span[2]/text()',
            'Terrible Marks': '/html/body/div[2]/div[2]/div[2]/div[6]/div/div[1]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/div/div[2]/div/div[5]/span[2]/text()'
        }

    # Определяем стандартный метод, вызываемый в самом начале работы по сбору данных
    def start_requests(self):
        # Для всех оставшихся URL_TA
        for url in self.urls:
            # Осуществляем запрос к сайту TripAdvisor и накапливаем результаты парсинга
            full_url = self.get_full_url(url)
            result = sc.Request(url=full_url, callback=self.parse)
            if result == None:
                print(f'Problem with URL: {full_url}')
            yield result

    # Определяем метод, который будет осуществлять разбор полученной по запросу страницы и заполнять соответствующие данные
    def parse(self, response):
        # Создаем пустой словарь для данных по ресторану
        restaurant = dict()

        # Получаем название ресторана
        restaurant['NewName'] = response.xpath(self.xpaths['Name']).get()
        
        is_closed = (restaurant['NewName'].find('CLOSED') != -1)

        # Пытаемся получить название города
        try:
            restaurant['NewCity'] = response.xpath(self.xpaths['City']).get()[15:]
        except:
            # Пробуем другой xpath
            try:
                restaurant['NewCity'] = response.xpath(self.xpaths['City_2']).get().split()[1]
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

        # Если ресторан не закрыт
        if not is_closed:
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

            # # Пробуем вычислить нормализованное значение ранга
            try:
                restaurant['New Relative Ranking'] = restaurant['New Ranking'] / restaurant['New Restaurants Count']
            except:
                # В исключительной ситуации ставим значение None
                restaurant['New Relative Ranking'] = None
                
        else:
            # В противном случае ставим все значения None
            restaurant['New Ranking'] = None
            restaurant['New Restaurants Count'] = None
            restaurant['New Relative Ranking'] = None


        # Пробуем получить значение рейтинга
        try:
            restaurant['New Rating'] = float(response.xpath(self.xpaths['Rating']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Rating'] = None
        
        # Получаем диапазон цен
        # По осносному
        price_range = response.xpath(self.xpaths['Price Range']).get()
        if price_range == None:
            # Или резервному XPath
            price_range = response.xpath(self.xpaths['Price Range_2']).get()
        
        # Пробуем получить значение диапазона цен
        try:
            # Если полученное значение не содержит знак '$'
            if price_range.find('$') == -1:
                # То это значит, что ресторан новый и для него еще нет данных по диапазону цен
                # Присваиваем значение None
                restaurant['New Price Range'] = None
            else:
                # Иначе считаем, что нашли правильное значение для New Price Range
                restaurant['New Price Range'] = price_range
        except:
            restaurant['New Price Range'] = None
        
        # Пробуем получить количество отзывов
        try:
            restaurant['New Number of Reviews'] = int(response.xpath(self.xpaths['Number of Reviews']).get().split()[0])
        except:
            # В исключительной ситуации ставим значение None
            restaurant['New Number of Reviews'] = None

        # Пробуем получить количество Excellent-оценок пользователей 
        try:
            restaurant['Excellent Marks'] = int(response.xpath(self.xpaths['Excellent Marks']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['Excellent Marks'] = None
        
        # Пробуем получить количество Very Good-оценок пользователей 
        try:
            restaurant['Very Good Marks'] = int(response.xpath(self.xpaths['Very Good Marks']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['Very Good Marks'] = None

        # Пробуем получить количество Average-оценок пользователей 
        try:
            restaurant['Average Marks'] = int(response.xpath(self.xpaths['Average Marks']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['Average Marks'] = None
        
        # Пробуем получить количество Poor-оценок пользователей 
        try:
            restaurant['Poor Marks'] = int(response.xpath(self.xpaths['Poor Marks']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['Poor Marks'] = None
        
        # Пробуем получить количество Terrible-оценок пользователей 
        try:
            restaurant['Terrible Marks'] = int(response.xpath(self.xpaths['Terrible Marks']).get())
        except:
            # В исключительной ситуации ставим значение None
            restaurant['Terrible Marks'] = None
    
        # Записываем URL_TA для дальнейшего сопоставления старого и нового датасетов
        restaurant['URL_TA'] = response.url[len(self.BASE_TA_URL):]

        # Отслеживаем прогресс и выводим информацию
        self.progress += 1
        print(f'{self.progress} of {self.max_progress} completed. Prorgess: {self.progress / self.max_progress:.2%} URL_TA = {restaurant["URL_TA"]}                                                                                                                                              \r', end='')

        # Возвращаем результат парсинга
        return restaurant
