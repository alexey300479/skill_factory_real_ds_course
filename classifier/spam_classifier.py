import json
import pandas as pd
import string


SPAM = True
NOT_SPAM = False

# Пробуем открыть файл со справочником слов, встречаемых в спам-текстах
try:
    spam_words = json.load('spam_words.json')
# Если такого файла еще нет, то создаем пустой справочник
except:
    spam_words = dict()

# Пробуем открыть файл со справочником слов, встречаемых в хороших текстах
try:
    good_words = json.load('good_words.json')
# Если такого файла еще нет, то создаем пустой справочник
except:
    good_words = dict()

# Пробуем открыть файл со счетчиками слов
try:
    words_count = json.load('words_count.json')
# Если такого файла еще нет, то создаем справочник с нулевыми значениями
except:
    words_count = {
        'spam': 0,
        'good': 0
    }

# Пробуем открыть файл с вероятностями
try:
    probs = json.load('probs.json')
# Если такого файла еще нет, то создаем справочник с нулевыми значениями
except:
    probs = {
        'spam_texts_count': 0,
        'good_texts_count': 0,
        'pA': 0,
        'pNotA': 0,
    }

# train_data = [  
#     ['Купите новое чистящее средство', SPAM],   
#     ['Купи мою новую книгу', SPAM],  
#     ['Подари себе новый телефон', SPAM],
#     ['Добро пожаловать и купите новый телевизор', SPAM],
#     ['Привет давно не виделись', NOT_SPAM], 
#     ['Довезем до аэропорта из пригорода всего за 399 рублей', SPAM], 
#     ['Добро пожаловать в Мой Круг', NOT_SPAM],  
#     ['Я все еще жду документы', NOT_SPAM],  
#     ['Приглашаем на конференцию Data Science', NOT_SPAM],
#     ['Потерял твой телефон напомни', NOT_SPAM],
#     ['Порадуй своего питомца новым костюмом', SPAM]
# ]

# Загружаем тренировочный датасет
train_data = pd.read_csv('spam_or_not_spam.csv')

# Удаляем единственную пустую строку
train_data.dropna(inplace=True)

# Приводим разметку к единому стилю
labels = {
    0: NOT_SPAM,
    1: SPAM
}
train_data['label'] = train_data['label'].map(labels)

# Создадим функцию, приводящую текст к нижнему регистру и очищающую его от знаков пунктуации
def get_words(text):
    '''
        Функция get_words(text) возвращает список слов текста в нижнем регистре, игнорируя знаки пунктуации.
        Аргументы:
            text - строка с текстом
        Результат:
            список слов (python list)
        Пример испольования:
            get_words('Hello, world!')
        вернет:
            ['hello', 'world']
    '''
    clean_text = text.lower()
    clean_text = ''.join(c for c in clean_text if c not in string.punctuation)
    words = clean_text.split()
    return words

def calculate_word_frequencies(body, label):
    '''
        Функция calculate_word_frequencies(body, label) заполняет словари
        spam_words и good_words, содержащие данные о количестве вхождений
        слов в тексты, помеченные как спам и не спам соответственно.
        Также эта функция обновляет справочник количеств слов words_count.
        Аргументы:
            body - текст
            label - один из двух вариантов констант SPAM (равносильно True)
            и NOT_SPAM (равносильно False)
        Возврат:
            Функция ничего не возвращает. Только меняет глобальные переменные
            spam_words, good_words, words_count.
    '''
    
    # Получим списки слов из текста
    words = get_words(body)
    
    # Обновим дaнные в счетчиках
    if label == SPAM:
        # Обновим счетчик текстов, содержащих спам
        probs['spam_texts_count'] += 1
        
        # Обновим счетчик слов сообщений, содержащих спам
        words_count['spam'] += len(words)
        
        # Обновим счетчики для каждого слова
        for word in words:
            try:
                spam_words[word] += 1
            except:
                spam_words[word] = 1
    else:
        # Обновим счетчик текстов, не содержащих спам
        probs['good_texts_count'] += 1
        
        # Обновим счетчик слов сообщений, не содержащих спам
        words_count['good'] += len(words)
        
        # Обновим счетчики для каждого слова
        for word in words:
            try:
                good_words[word] += 1
            except:
                good_words[word] = 1    

def train():
    converted_data = zip(train_data['email'], train_data['label'])

    # Заполним справочники
    for data in converted_data:
        calculate_word_frequencies(*data)
    
    # Вычислим вероятности
    texts_count = probs['spam_texts_count'] + probs['good_texts_count']
    probs['pA'] = probs['spam_texts_count'] / texts_count
    probs['pNotA'] = probs['good_texts_count'] / texts_count

def calculate_P_Bi_A(word, label):
    '''
        Функция calculate_P_Bi_A(word, label) возвращает вероятность того,
        что слово word встретится в сообщении содержащем спам, при label == SPAM,
        или вероятность того, что слово встретится в сообщении не содержащем спам,
        при label != SPAM
    '''
    if label == SPAM:
        try:
            word_count = spam_words[word]
        except KeyError:
            word_count = 1
            # spam_words[word] = 1
            # words_count['spam'] += 1
        return word_count / words_count['spam']
    else:
        try:
            word_count = good_words[word]
        except KeyError:
            word_count = 1
            # good_words[word] = 1
            # words_count['good'] += 1
        return word_count / words_count['good']

def calculate_P_B_A(text, label):
    '''
        Функция calculate_P_B_A(text, label) возвращает вероятность спама для строки text
        при label == SPAM и вероятность не спама в противном случае
    '''
    # Сначала получим список слов
    words = get_words(text)
    
    prob = 1.0
    for word in words:
        prob *= (1.0 + calculate_P_Bi_A(word, label))
    
    return prob

def classify(email):
    spam_prob = calculate_P_B_A(email, SPAM)
    not_spam_prob = calculate_P_B_A(email, NOT_SPAM)
    print(f'Spam probability is: {spam_prob}')
    print(f'Not spam probability is: {not_spam_prob}')
    return spam_prob > not_spam_prob
