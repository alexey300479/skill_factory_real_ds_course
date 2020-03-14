# classifier/application/routes.py
from flask import Flask, request, jsonify
from application import app 
from spam_classifier import classify
'''
Cкрипт run.py находится на верхнем уровне и содержит всего одну строку, которая
импортирует экземпляр приложения: from application import app
'''

'''
Декоратор @app.route создает связь между URL-адресом, заданным как 
аргумент (/), и функцией hello_world().  Это означает, что когда веб-браузер
запрашивает этот URL-адрес, Flask будет вызывать эту функцию и передавать ее 
возвращаемое значение обратно в браузер в качестве ответа.
'''

@app.route('/classify_text', methods=['POST'])
def classify_text():
    data = request.json
    text = data.get('text')
    #Метод возвращает None, если запрашиваемого ключа нет
    if text is None:
        params = ', '.join(data.keys()) 
        #Преобразуем все полученные параметры в строку
        return jsonify({'message': f'Parametr "{params}" is invalid'}), 400 
    #Ранее мы не указывали код ответа HTTP явно,
    #но на самом деле Flask выполнял эту работу за нас. 
    #По умолчанию возвращается 200
    else:
        result = classify(text)
        return jsonify({'result': result})