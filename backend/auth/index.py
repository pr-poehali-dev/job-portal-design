"""API для регистрации и авторизации пользователей"""
import json
import os
import psycopg2
from datetime import datetime, timedelta
import secrets
import hashlib
import traceback

SCHEMA = 't_p39827575_job_portal_design'

def get_db_connection():
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        if action == 'register':
            email = body.get('email')
            password = body.get('password')
            user_type = body.get('user_type')
            name = body.get('name')
            
            if not all([email, password, user_type, name]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email уже зарегистрирован'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(password)
            token = generate_token()
            expires_at = (datetime.now() + timedelta(days=30)).isoformat()
            
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, password_hash, user_type, is_active) VALUES (%s, %s, %s, TRUE) RETURNING id",
                (email, password_hash, user_type)
            )
            user_id = cur.fetchone()[0]
            
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires_at)
            )
            
            if user_type == 'employer':
                cur.execute(
                    f"INSERT INTO {SCHEMA}.employers (user_id, company_name) VALUES (%s, %s)",
                    (user_id, name)
                )
            else:
                names = name.split(' ', 1)
                first_name = names[0] if len(names) > 0 else name
                last_name = names[1] if len(names) > 1 else ''
                cur.execute(
                    f"INSERT INTO {SCHEMA}.jobseekers (user_id, first_name, last_name) VALUES (%s, %s, %s)",
                    (user_id, first_name, last_name)
                )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': email,
                        'name': name,
                        'user_type': user_type
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email')
            password = body.get('password')
            
            if not all([email, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Введите email и пароль'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(password)
            
            cur.execute(
                f"SELECT id, email, user_type FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                    'isBase64Encoded': False
                }
            
            token = generate_token()
            expires_at = (datetime.now() + timedelta(days=30)).isoformat()
            
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user[0], token, expires_at)
            )
            
            conn.commit()
            
            user_name = ''
            if user[2] == 'employer':
                cur.execute(f"SELECT company_name FROM {SCHEMA}.employers WHERE user_id = %s", (user[0],))
                employer = cur.fetchone()
                if employer:
                    user_name = employer[0]
            else:
                cur.execute(f"SELECT first_name, last_name FROM {SCHEMA}.jobseekers WHERE user_id = %s", (user[0],))
                seeker = cur.fetchone()
                if seeker:
                    user_name = f"{seeker[0]} {seeker[1]}".strip()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'email': user[1],
                        'user_type': user[2],
                        'name': user_name
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'verify':
            token = body.get('token')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не предоставлен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"""
                SELECT u.id, u.email, u.user_type
                FROM {SCHEMA}.sessions s 
                JOIN {SCHEMA}.users u ON s.user_id = u.id 
                WHERE s.token = %s AND s.expires_at > NOW()
                """,
                (token,)
            )
            user = cur.fetchone()
            
            if not user:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Недействительный токен'}),
                    'isBase64Encoded': False
                }
            
            user_name = ''
            if user[2] == 'employer':
                cur.execute(f"SELECT company_name FROM {SCHEMA}.employers WHERE user_id = %s", (user[0],))
                employer = cur.fetchone()
                if employer:
                    user_name = employer[0]
            else:
                cur.execute(f"SELECT first_name, last_name FROM {SCHEMA}.jobseekers WHERE user_id = %s", (user[0],))
                seeker = cur.fetchone()
                if seeker:
                    user_name = f"{seeker[0]} {seeker[1]}".strip()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {
                        'id': user[0],
                        'email': user[1],
                        'user_type': user[2],
                        'name': user_name
                    }
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {str(e)}")
        print(f"Traceback: {error_trace}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'trace': error_trace}),
            'isBase64Encoded': False
        }