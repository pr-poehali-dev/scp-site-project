import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление заявками на доступ к SCP Foundation
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'submit':
                full_name = body_data.get('full_name', '')
                age = body_data.get('age', 0)
                email = body_data.get('email', '')
                message = body_data.get('message', '')
                
                cur.execute(
                    "INSERT INTO applications (full_name, age, email, message, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (full_name, age, email, message, 'pending')
                )
                app_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'id': app_id, 'message': 'Заявка успешно отправлена'})
                }
            
            elif action == 'update_status':
                app_id = body_data.get('id')
                status = body_data.get('status')
                
                cur.execute(
                    "UPDATE applications SET status = %s WHERE id = %s",
                    (status, app_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'message': 'Статус обновлен'})
                }
        
        elif method == 'GET':
            cur.execute(
                "SELECT id, full_name, age, email, message, status, created_at FROM applications ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            
            applications = []
            for row in rows:
                applications.append({
                    'id': row[0],
                    'full_name': row[1],
                    'age': row[2],
                    'email': row[3],
                    'message': row[4],
                    'status': row[5],
                    'created_at': str(row[6])
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'applications': applications})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
