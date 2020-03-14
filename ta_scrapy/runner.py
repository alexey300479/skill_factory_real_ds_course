import scrapy
from scrapy.crawler import CrawlerProcess

from ta_scrapy.spiders.ta_spyder import TASpider

process = CrawlerProcess({
    'FEED_FORMAT': 'csv',
    'FEED_URI': 'fresh_data.csv'
})

process.crawl(TASpider)
process.start() # the script will block here until the crawling is finished