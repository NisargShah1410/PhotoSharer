import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'usersCloud'

def lambda_handler(event, context):
    request_body = json.loads(event['body'])
    user_email = request_body['user_email']
    print(user_email)

    try:
        response = delete_team_user(request_body)
        return {
            'statusCode': 200,
            'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            'body': json.dumps({'message': response})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
            'body': json.dumps({'error': str(e)})
        }

def delete_team_user(request_body):
    table = dynamodb.Table(table_name)
    
    # Perform a scan to find the user with the given email
    response = table.scan(
        FilterExpression='email = :userEmail',
        ExpressionAttributeValues={':userEmail': request_body['user_email']}
    )
    
    print(response)
    
    items = response['Items']
    
    print(items)
    if len(items) > 0:
        user_id = items[0]['user_id']
        
        # Update the user's group_name and group_id
        table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET group_name = :updateTeamName, group_id = :updateTeamID',
            ExpressionAttributeValues={
                ':updateTeamName': request_body['group_name'],
                ':updateTeamID': request_body['group_id'],
            }
        )
        
        return 'Group member\'s group id and group name removed successfully by delete team button'
    else:
        raise Exception('User with the given email not found')
