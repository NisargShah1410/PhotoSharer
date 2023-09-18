import boto3
import json
from decimal import Decimal

def lambda_handler(event, context):
    print(event['body'])
    request_body = json.loads(event['body'])
    group_id = request_body['group_id']
    print(group_id)

    if not group_id:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing group_id parameter in the request.'),
            'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
        }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('imageCloud')

    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('group_id').eq(group_id)
    )

    items = response['Items']
    print(items)

    for item in items:
        for key, value in item.items():
            if isinstance(value, Decimal):
                if value % 1 == 0:
                    item[key] = int(value)
                else:
                    item[key] = float(value)
    print(items)

    return {
        'statusCode': 200,
        'body': json.dumps(items),
        'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
    }
