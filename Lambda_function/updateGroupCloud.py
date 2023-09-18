import json
import boto3

dynamodb_table = 'groupsCloud'
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
updateGroup = boto3.client('dynamodb')


def lambda_handler(event, context):
    print(json.loads(event['body']))
    print(json.loads(event['body'])['group_id'])
    print(json.loads(event['body'])['new_member'])
    response = update_team(json.loads(event['body']))
    return response


def update_team(request_body):
    try:
        t_id = request_body['group_id']
        response = updateGroup.get_item(TableName=dynamodb_table, Key={'group_id': {'N': str(t_id)}})
        item = response.get('Item')

        if item:
            existing_users = item.get('group_members', {'L': []})['L']
            updated_users = existing_users + [{'S': request_body['new_member']}]

            updateGroup.update_item(
                TableName=dynamodb_table,
                Key={'group_id': {'N': str(t_id)}},
                UpdateExpression='SET group_members = :updatedUsers',
                ExpressionAttributeValues={':updatedUsers': {'L': updated_users}}
            )

        print('New user added to the team successfully.')

        response_body = {
            'message': 'New user added to the team successfully.',
            'statusCode': 200
        }

    except Exception as e:
        print('Error adding new user to the team:', e)
        response_body = {
            'message': 'Error adding new user to the team.',
            'statusCode': 500
        }

    return {
        'statusCode': response_body['statusCode'],
        'body': json.dumps(response_body),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST',
        },
    }
