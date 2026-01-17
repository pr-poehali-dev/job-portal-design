import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получение списка вакансий из базы данных
    Args: event - dict с httpMethod, queryStringParameters
          context - объект контекста Cloud Function
    Returns: HTTP response с JSON списком вакансий
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
                    v.image_url,
                    e.company_description,
                    e.company_size,
                    (SELECT COUNT(DISTINCT ip_address) FROM vacancy_views WHERE vacancy_id = v.id) as views_count
                FROM vacancies v
                JOIN employers e ON v.employer_id = e.id
                WHERE v.is_active = true
                ORDER BY v.published_at DESC
            '''
            
            cur.execute(query)
            vacancies = cur.fetchall()
            
            result = []
            for vac in vacancies:
                salary = ''
                if vac['salary_from'] and vac['salary_to']:
                    salary = f"{vac['salary_from']:,} - {vac['salary_to']:,} ₽".replace(',', ' ')
                elif vac['salary_from']:
                    salary = f"от {vac['salary_from']:,} ₽".replace(',', ' ')
                elif vac['salary_to']:
                    salary = f"до {vac['salary_to']:,} ₽".replace(',', ' ')
                
                images = [
                    'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/908cd9c2-2fb1-4827-8c90-49133bc8ae55.jpg',
                    'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/f2b915ff-e0aa-402a-96fb-d6bd91f7eaa6.jpg',
                    'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/338e2128-e5ca-4221-9d74-bd38ef0de21f.jpg'
                ]
                
                result.append({
                    'id': vac['id'],
                    'title': vac['title'],
                    'company': vac['company'],
                    'location': vac['location'],
                    'salary': salary,
                    'description': vac['description'],
                    'tags': vac['tags'] or [],
                    'requirements': vac['requirements'] or [],
                    'responsibilities': vac['responsibilities'] or [],
                    'conditions': vac['conditions'] or [],
                    'experience': vac['experience'],
                    'employmentType': 'Полная занятость' if vac['employment_type'] == 'full_time' else 'Частичная занятость',
                    'companyDescription': vac['company_description'],
                    'companySize': vac['company_size'],
                    'publishedDate': vac['published_at'].strftime('%d %B %Y') if vac['published_at'] else '',
                    'image': vac['image_url'] or images[vac['id'] % len(images)],
                    'rating': 4 if vac['id'] % 2 == 0 else 5,
                    'reviews': vac['views_count'] if vac['views_count'] else 0,
                    'priceFrom': vac['salary_from'] if vac['salary_from'] else 50000
                })
            
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