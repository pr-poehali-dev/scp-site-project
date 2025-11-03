'''
Business: Handles secret section authentication - user registration, login, and listing
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with user data or error
'''

import json
import os
import hashlib
from typing import Dict, Any, Optional
from dataclasses import dataclass

import psycopg2
from psycopg2.extras import RealDictCursor

@dataclass
class User:
    id: int
    username: str
    email: str
    created_at: str

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('SELECT id, username, email, created_at FROM secret_users ORDER BY created_at DESC')
        users = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'users': users}, default=str)
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            username = body_data.get('username', '').strip()
            email = body_data.get('email', '').strip().lower()
            password = body_data.get('password', '')
            
            if not username or not email or not password:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Заполните все поля'})
                }
            
            if len(password) < 6:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Пароль должен быть не менее 6 символов'})
                }
            
            cur.execute('SELECT id FROM secret_users WHERE email = %s', (email,))
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Email уже зарегистрирован'})
                }
            
            password_hash = hash_password(password)
            cur.execute(
                'INSERT INTO secret_users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id',
                (username, email, password_hash)
            )
            new_user_id = cur.fetchone()
            conn.commit()
            
            cur.execute(
                'SELECT id, username, email, created_at FROM secret_users WHERE id = %s',
                (new_user_id['id'],)
            )
            user_data = cur.fetchone()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'user': dict(user_data)}, default=str)
            }
        
        if action == 'login':
            email = body_data.get('email', '').strip().lower()
            password = body_data.get('password', '')
            
            if not email or not password:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Заполните все поля'})
                }
            
            password_hash = hash_password(password)
            cur.execute(
                'SELECT id, username, email, created_at FROM secret_users WHERE email = %s AND password_hash = %s',
                (email, password_hash)
            )
            user = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Неверный email или пароль'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'user': dict(user)}, default=str)
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': 'Неизвестное действие'})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }