import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получение детальной информации о вакансии
    Args: event - dict с httpMethod, pathParams
          context - объект контекста Cloud Function
    Returns: HTTP response с JSON данными вакансии
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    vacancy_id = params.get('id')
    
    if not vacancy_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Vacancy ID is required'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = '''
                SELECT 
                    v.id,
                    v.title,
                    e.company_name as company,
                    v.city as location,
                    v.salary_from,
                    v.salary_to,
                    v.description,
                    v.requirements,
                    v.responsibilities,
                    v.conditions,
                    v.skills as tags,
                    v.experience_level as experience,
                    v.employment_type,
                    v.published_at,
                    e.company_description,
                    e.company_size
                FROM vacancies v
                JOIN employers e ON v.employer_id = e.id
                WHERE v.id = %s AND v.is_active = true
            '''
            
            cur.execute(query, (vacancy_id,))
            vac = cur.fetchone()
            
            if not vac:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Vacancy not found'}),
                    'isBase64Encoded': False
                }
            
            salary = ''
            if vac['salary_from'] and vac['salary_to']:
                salary = f"{vac['salary_from']:,} - {vac['salary_to']:,} ₽".replace(',', ' ')
            elif vac['salary_from']:
                salary = f"от {vac['salary_from']:,} ₽".replace(',', ' ')
            elif vac['salary_to']:
                salary = f"до {vac['salary_to']:,} ₽".replace(',', ' ')
            
            result = {
                'id': vac['id'],
                'title': vac['title'],
                'company': vac['company'],
                'location': vac['location'],
                'salary': salary,
                'description': vac['description'],
                'requirements': vac['requirements'] or [],
                'responsibilities': vac['responsibilities'] or [],
                'conditions': vac['conditions'] or [],
                'tags': vac['tags'] or [],
                'experience': vac['experience'],
                'employmentType': 'Полная занятость' if vac['employment_type'] == 'full_time' else 'Частичная занятость',
                'companyDescription': vac['company_description'],
                'companySize': vac['company_size'],
                'publishedDate': vac['published_at'].strftime('%d декабря %Y') if vac['published_at'] else ''
            }
            
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()
