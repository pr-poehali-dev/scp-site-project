'''
Business: Управление суффиксами пользователей - назначение должностей
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response со списком суффиксов или статусом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        email = params.get('email', '').strip()
        
        if email:
            email_escaped = email.replace("'", "''")
            cursor.execute(
                f"SELECT suffix FROM user_suffixes WHERE email = '{email_escaped}'"
            )
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'suffix': result['suffix'] if result else None}),
                'isBase64Encoded': False
            }
        
        cursor.execute("SELECT id, email, suffix, assigned_at FROM user_suffixes ORDER BY assigned_at DESC")
        suffixes = cursor.fetchall()
        
        suffixes_list = []
        for s in suffixes:
            suffixes_list.append({
                'id': s['id'],
                'email': s['email'],
                'suffix': s['suffix'],
                'assigned_at': s['assigned_at'].isoformat() if s['assigned_at'] else None
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'suffixes': suffixes_list}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        email = body_data.get('email', '').strip()
        suffix = body_data.get('suffix', '').strip()
        
        if not email or not suffix:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email and suffix are required'}),
                'isBase64Encoded': False
            }
        
        email_escaped = email.replace("'", "''")
        suffix_escaped = suffix.replace("'", "''")
        
        cursor.execute(
            f"INSERT INTO user_suffixes (email, suffix) VALUES ('{email_escaped}', '{suffix_escaped}') "
            f"ON CONFLICT (email) DO UPDATE SET suffix = '{suffix_escaped}', assigned_at = CURRENT_TIMESTAMP "
            f"RETURNING id"
        )
        result = cursor.fetchone()
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'id': result['id']}),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        email = body_data.get('email', '').strip()
        
        if not email:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email is required'}),
                'isBase64Encoded': False
            }
        
        email_escaped = email.replace("'", "''")
        cursor.execute(f"DELETE FROM user_suffixes WHERE email = '{email_escaped}'")
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
