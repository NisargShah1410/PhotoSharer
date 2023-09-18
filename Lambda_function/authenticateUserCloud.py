import boto3
import json
import uuid
import hashlib

dynamodb = boto3.resource('dynamodb')
table_name = 'usersCloud'

#Code to authenticate user from details stored in DynamoDB database
def lambda_handler(event, context):
    try:
        # Get user credentials from the event (e.g., email, password)
        data = json.loads(event['body'])
        email = data['email']
        password = data['password']

        # Retrieve user details from DynamoDB
        table = dynamodb.Table(table_name)
        response = table.scan(FilterExpression=boto3.dynamodb.conditions.Attr('email').eq(email))
        user = response['Items'][0] if response['Items'] else None

        if not user:
            return {
                'statusCode': 401,
                'body': 'No use found with this email.',
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            }

        # Hash the provided password using SHA-256 and compare with the stored hashed password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        if hashed_password == user['password']:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'User authenticated successfully!', 'user_id': user['user_id']}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            }
        else:
            return {
                'statusCode': 402,
                'body': 'Invalid credentials. Authentication failed.',
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            }

    except Exception as e:
        # Return error response if any exception occurs
        return {
            'statusCode': 500,
            'body': str(e),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
