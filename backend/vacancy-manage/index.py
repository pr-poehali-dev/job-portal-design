import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для создания, обновления и получения вакансий работодателя'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # GET - получить вакансии работодателя
        if method == 'GET':
            employer_id = event.get('queryStringParameters', {}).get('employer_id')
            vacancy_id = event.get('queryStringParameters', {}).get('vacancy_id')
            
            if vacancy_id:
                # Получить одну вакансию
                cur.execute('''
                    SELECT v.*, 
                           (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count,
                           (SELECT COUNT(DISTINCT ip_address) FROM vacancy_views 
                            WHERE vacancy_id = v.id) as views_count
                    FROM vacancies v
                    WHERE v.id = %s
                ''', (vacancy_id,))
                vacancy = cur.fetchone()
                
                if not vacancy:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Vacancy not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(vacancy), default=str)
                }
            
            elif employer_id:
                # Получить все вакансии работодателя
                cur.execute('''
                    SELECT v.*, 
                           (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count,
                           (SELECT COUNT(DISTINCT ip_address) FROM vacancy_views 
                            WHERE vacancy_id = v.id) as views_count
                    FROM vacancies v
                    WHERE v.employer_id = %s
                    ORDER BY v.created_at DESC
                ''', (employer_id,))
                vacancies = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(v) for v in vacancies], default=str)
                }
            
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'employer_id or vacancy_id required'})
            }
        
        # POST - создать вакансию
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO vacancies (
                    employer_id, title, description, requirements, responsibilities, 
                    conditions, salary_from, salary_to, city, employment_type, 
                    experience_level, skills, status, image_url
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                data.get('employer_id'),
                data.get('title'),
                data.get('description'),
                data.get('requirements', []),
                data.get('responsibilities', []),
                data.get('conditions', []),
                data.get('salary_from'),
                data.get('salary_to'),
                data.get('city'),
                data.get('employment_type', 'full_time'),
                data.get('experience'),
                data.get('skills', []),
                'active',
                data.get('image_url')
            ))
            
            vacancy_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': vacancy_id, 'message': 'Vacancy created'})
            }
        
        # PUT - обновить вакансию
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            vacancy_id = data.get('id')
            
            if not vacancy_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'vacancy id required'})
                }
            
            cur.execute('''
                UPDATE vacancies SET
                    title = %s,
                    description = %s,
                    requirements = %s,
                    responsibilities = %s,
                    conditions = %s,
                    salary_from = %s,
                    salary_to = %s,
                    city = %s,
                    employment_type = %s,
                    experience_level = %s,
                    skills = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s AND employer_id = %s
                RETURNING id
            ''', (
                data.get('title'),
                data.get('description'),
                data.get('requirements', []),
                data.get('responsibilities', []),
                data.get('conditions', []),
                data.get('salary_from'),
                data.get('salary_to'),
                data.get('city'),
                data.get('employment_type'),
                data.get('experience'),
                data.get('skills', []),
                vacancy_id,
                data.get('employer_id')
            ))
            
            result = cur.fetchone()
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Vacancy not found or access denied'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Vacancy updated'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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
