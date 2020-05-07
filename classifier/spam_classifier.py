import numpy as np
import pandas as pd
import string

SPAM = True
NOT_SPAM = False

spam_words = dict()

good_words = dict()

words_count = {
    'spam': 0,
    'good': 0
}

probs = {
    'spam_texts_count': 0,
    'good_texts_count': 0,
    'pA': 0,
    'pNotA': 0,
}

train_data = pd.read_csv('spam_or_not_spam.csv')
train_data.dropna(inplace=True)

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

# Создадим функцию, заполняющие справочники со счетчиками слов
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

#  Создадим функцию, обучающую нашу модель на тенировочной выборке
def train(train_data):
    # Заполним справочники
    for data in train_data:
        calculate_word_frequencies(*data)
    
    # Вычислим вероятности
    texts_count = probs['spam_texts_count'] + probs['good_texts_count']
    probs['pA'] = np.longdouble(probs['spam_texts_count']) / np.longdouble(texts_count)
    probs['pNotA'] = np.longdouble(probs['good_texts_count']) / np.longdouble(texts_count)

# Произведем обучение
train(zip(train_data['email'], train_data['label']))

# Создадим функцию, рассчитывающую вероятность того, что слово word может встретиться в спаме или нормальном сообщении
def calculate_P_Bi_A(word, label):
    '''
        Функция calculate_P_Bi_A(word, label) возвращает вероятность того,
        что слово word встретится в сообщении содержащем спам, при label == SPAM,
        или вероятность того, что слово встретится в сообщении не содержащем спам,
        при label == NOT_SPAM
    '''
    if label == SPAM:
        try:
            word_count = spam_words[word]
        except:
#             word_count = 0.00001
            word_count = 0
        return np.longdouble(1+ word_count) / (np.longdouble(len(spam_words)) + np.longdouble(words_count['spam']))
#         return np.longdouble(word_count) / np.longdouble(words_count['spam'])
    else:
        try:
            word_count = good_words[word]
        except:
#             word_count = 0.00001
            word_count = 0
        return np.longdouble(1+word_count) / (np.longdouble(len(good_words)) + np.longdouble(words_count['good']))
#         return np.longdouble(word_count) / np.longdouble(words_count['good'])

def calculate_P_B_A(text, label):
    '''
        Функция calculate_P_B_A(text, label) возвращает вероятность спама для строки text
        при label == SPAM и вероятность не спама в противном случае
    '''
    # Сначала получим список слов
    words = get_words(text)
    
    # Вычисляем общую вероятность перемножением вероятностей по каждому слову
    # Что равнозначно сложению натуральных логарифмов вероятностей
    prob_ln = np.longdouble(0)
    for word in words:
        prob_ln += np.log(calculate_P_Bi_A(word, label))
    
    return prob_ln

# Создадим функцию классификации, возвращающую True, если текст относится к спаму и False в противном случае
def classify(email):
    spam_prob_ln = calculate_P_B_A(email, SPAM) + np.log(np.longdouble(probs['pA']))
    not_spam_prob_ln = calculate_P_B_A(email, NOT_SPAM) + np.log(np.longdouble(probs['pNotA']))
    return spam_prob_ln > not_spam_prob_ln
