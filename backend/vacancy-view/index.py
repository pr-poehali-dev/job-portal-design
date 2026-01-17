import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для регистрации просмотра вакансии и получения статистики'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    data = json.loads(event.get('body', '{}'))
    vacancy_id = data.get('vacancy_id')
    user_id = data.get('user_id')
    employer_id = data.get('employer_id')
    
    if not vacancy_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'vacancy_id required'})
        }
    
    # Получаем IP адрес из события
    ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '0.0.0.0')
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Проверяем, не является ли просматривающий владельцем вакансии
        if employer_id:
            cur.execute('SELECT employer_id FROM vacancies WHERE id = %s', (vacancy_id,))
            vacancy = cur.fetchone()
            if vacancy and vacancy['employer_id'] == employer_id:
                # Владелец не считается в просмотрах
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Owner view not counted'})
                }
        
        # Пытаемся добавить просмотр (игнорируем дубликаты по IP и дате)
        cur.execute('''
            INSERT INTO vacancy_views (vacancy_id, user_id, ip_address, viewed_at)
            SELECT %s, %s, %s, CURRENT_DATE
            WHERE NOT EXISTS (
                SELECT 1 FROM vacancy_views 
                WHERE vacancy_id = %s 
                AND ip_address = %s 
                AND viewed_at = CURRENT_DATE
            )
        ''', (vacancy_id, user_id, ip_address, vacancy_id, ip_address))
        
        conn.commit()
        
        # Получаем актуальное количество просмотров
        cur.execute('''
            SELECT COUNT(DISTINCT ip_address) as views_count
            FROM vacancy_views
            WHERE vacancy_id = %s
        ''', (vacancy_id,))
        
        result = cur.fetchone()
        views_count = result['views_count'] if result else 0
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'views_count': views_count})
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()
