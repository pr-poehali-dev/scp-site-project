'''
Business: Управление чатом сотрудников SCP - получение и отправка сообщений
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с сообщениями или статусом операции
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        limit = int(params.get('limit', '50'))
        
        cursor.execute(
            f"SELECT id, username, message, created_at FROM personnel_chat ORDER BY created_at DESC LIMIT {limit}"
        )
        messages = cursor.fetchall()
        
        messages_list = []
        for msg in messages:
            messages_list.append({
                'id': msg['id'],
                'username': msg['username'],
                'message': msg['message'],
                'created_at': msg['created_at'].isoformat() if msg['created_at'] else None
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'messages': list(reversed(messages_list))}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username', '').strip()
        message = body_data.get('message', '').strip()
        
        if not username or not message:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Username and message are required'}),
                'isBase64Encoded': False
            }
        
        username_escaped = username.replace("'", "''")
        message_escaped = message.replace("'", "''")
        
        cursor.execute(
            f"INSERT INTO personnel_chat (username, message) VALUES ('{username_escaped}', '{message_escaped}') RETURNING id, created_at"
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
            'body': json.dumps({
                'success': True,
                'id': result['id'],
                'created_at': result['created_at'].isoformat()
            }),
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
