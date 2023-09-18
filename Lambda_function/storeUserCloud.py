import boto3
import json
import uuid
import hashlib

dynamodb = boto3.resource('dynamodb')
table_name = 'usersCloud'

#Code to register user and store data in dynamoDB
def lambda_handler(event, context):
    try:
        # Get user details from the event (e.g., email, username, password)
        data = json.loads(event['body'])
        email = data['email']
        username = data['username']
        password = data['password']

        # Check if the user already exists in the database
        storeTable = dynamodb.Table(table_name)
        response = storeTable.scan(FilterExpression=boto3.dynamodb.conditions.Attr('email').eq(email))
        if response['Items']:
            return {
                'statusCode': 409,
                'body': 'User with this email already exists.',
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            }

        # Generate a unique user ID (e.g., using UUID)
        user_id = str(uuid.uuid4())

        # Hash the password using SHA-256
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Store user details in DynamoDB
        storeTable.put_item(Item={
            'user_id': user_id,
            'email': email,
            'username': username,
            'password': hashed_password
        })

        # Return success response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User registered successfully!', 'user_id': user_id}),
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
