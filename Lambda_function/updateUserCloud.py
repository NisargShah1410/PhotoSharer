import json
import boto3

dynamodb_table = 'usersCloud'
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
updateUser = boto3.client('dynamodb')

def lambda_handler(event, context):
    print(json.loads(event['body']))
    print(json.loads(event['body'])['uid'])
    print(json.loads(event['body'])['group_id'])
    print(json.loads(event['body'])['group_name'])
    response = update_user(json.loads(event['body']))
    return response

def update_user(request_body):
    try:
        user_id = request_body['uid']
        response = updateUser.get_item(TableName=dynamodb_table, Key={'user_id': {'S': user_id}})
        item = response.get('Item')

        if item:
            group_name = request_body['group_name']
            group_id = request_body['group_id']

            updateUser.update_item(
                TableName=dynamodb_table,
                Key={'user_id': {'S': user_id}},
                UpdateExpression='SET group_name = :group_name, group_id = :group_id',
                ExpressionAttributeValues={
                    ':group_name': {'S': group_name},
                    ':group_id': {'N': str(group_id)}
                }
            )
            print('User information updated successfully.')
            response_body = {
                'message': 'User information updated successfully.',
                'statusCode': 200
            }
        else:
            print('User not found in the database.')
            response_body = {
                'message': 'User not found in the database.',
                'statusCode': 404
            }

    except Exception as e:
        print('Error updating User information:', e)
        response_body = {
            'message': 'Error updating team information.',
            'statusCode': 500
        }
    return {
        'statusCode': response_body['statusCode'],
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(response_body),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST',
        },
    }
