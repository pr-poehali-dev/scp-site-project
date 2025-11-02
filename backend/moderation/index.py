'''
Business: Handles user moderation and reports - ban, kick, mute, warnings, user reports
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with punishment/report data or success status
'''

import json
import os
from typing import Dict, Any
from datetime import datetime, timedelta

import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

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
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        data_type = params.get('type', 'punishments')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if data_type == 'reports':
            cur.execute('''
                SELECT r.id, r.reported_user_id, r.reporter_email, r.reason, r.status, r.created_at,
                       u.username as reported_username, u.email as reported_email
                FROM user_reports r
                LEFT JOIN secret_users u ON r.reported_user_id = u.id
                ORDER BY r.created_at DESC
            ''')
            reports = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'reports': reports}, default=str)
            }
        else:
            cur.execute('''
                SELECT p.id, p.user_id, p.punishment_type, p.reason, p.duration_minutes, 
                       p.expires_at, p.warnings_count, p.created_at, p.created_by,
                       u.username, u.email
                FROM user_punishments p
                LEFT JOIN secret_users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
            ''')
            punishments = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'punishments': punishments}, default=str)
            }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'punish':
            user_id = body_data.get('user_id')
            punishment_type = body_data.get('punishment_type')
            reason = body_data.get('reason', '').strip()
            duration_minutes = body_data.get('duration_minutes')
            created_by = body_data.get('created_by', 'admin')
            
            if not user_id or not punishment_type or not reason:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Заполните все поля'})
                }
            
            expires_at = None
            if duration_minutes:
                expires_at = datetime.now() + timedelta(minutes=duration_minutes)
            
            warnings_count = 0
            if punishment_type == 'warning':
                cur.execute(
                    'SELECT COUNT(*) as count FROM user_punishments WHERE user_id = %s AND punishment_type = %s',
                    (user_id, 'warning')
                )
                result = cur.fetchone()
                warnings_count = result['count'] + 1 if result else 1
            
            cur.execute(
                '''INSERT INTO user_punishments 
                   (user_id, punishment_type, reason, duration_minutes, expires_at, warnings_count, created_by) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)''',
                (user_id, punishment_type, reason, duration_minutes, expires_at, warnings_count, created_by)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'warnings_count': warnings_count})
            }
        
        if action == 'submit_report':
            reported_user_id = body_data.get('reported_user_id')
            reporter_email = body_data.get('reporter_email', '').strip()
            reason = body_data.get('reason', '').strip()
            
            if not reported_user_id or not reporter_email or not reason:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Заполните все поля'})
                }
            
            cur.execute(
                'INSERT INTO user_reports (reported_user_id, reporter_email, reason) VALUES (%s, %s, %s)',
                (reported_user_id, reporter_email, reason)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        if action == 'update_report_status':
            report_id = body_data.get('id')
            status = body_data.get('status')
            
            if not report_id or not status:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'Недостаточно данных'})
                }
            
            cur.execute('UPDATE user_reports SET status = %s WHERE id = %s', (status, report_id))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        if action == 'check_user_status':
            user_id = body_data.get('user_id')
            
            if not user_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': False, 'error': 'user_id обязателен'})
                }
            
            cur.execute(
                '''SELECT punishment_type, expires_at, warnings_count 
                   FROM user_punishments 
                   WHERE user_id = %s AND (expires_at IS NULL OR expires_at > NOW())
                   ORDER BY created_at DESC LIMIT 1''',
                (user_id,)
            )
            punishment = cur.fetchone()
            
            cur.execute(
                'SELECT COUNT(*) as count FROM user_punishments WHERE user_id = %s AND punishment_type = %s',
                (user_id, 'warning')
            )
            warnings_result = cur.fetchone()
            total_warnings = warnings_result['count'] if warnings_result else 0
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'punishment': dict(punishment) if punishment else None,
                    'total_warnings': total_warnings
                }, default=str)
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': 'Неизвестное действие'})
        }
    
    if method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        punishment_id = body_data.get('id')
        
        if not punishment_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': False, 'error': 'ID обязателен'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM user_punishments WHERE id = %s', (punishment_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }