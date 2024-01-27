import json

def lambda_handler(event, context):
    # Enable CORS for cross-origin requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
        'Content-Type': 'application/json'
    }


    try:
        body = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Invalid JSON format'})
        }

    username = body.get('username')
    password = body.get('password')

    if username == 'test@gmail.com' and password == 'test':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Login successful'})
        }
    else:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'message': 'Login failed'})
        }
