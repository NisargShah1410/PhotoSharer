import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'groupsCloud'

def list_items(groupid):
    table = dynamodb.Table(table_name)
    params = {
        'TableName': table_name,
        'KeyConditionExpression': 'group_id = :groupIdValue',
        'ExpressionAttributeValues': {
            ':groupIdValue': groupid,
        }
    }

    try:
        response = table.query(**params)
        print(response)
        items = response['Items']

        # Convert 'Decimal' objects to regular integers or floats
        for item in items:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    if value % 1 == 0:
                        item[key] = int(value)
                    else:
                        item[key] = float(value)

        return items
    except Exception as e:
        return str(e)

def lambda_handler(event, context):
    print(event['body'])
    data = json.loads(event["body"])
    print(data)
    groupid = data["id"]
    print(groupid)

    try:
        data = list_items(groupid)
        print(data)
        return {
            'statusCode': 200,
            'body': json.dumps(data),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
    except Exception as e:
        return  {
            'statusCode': 500,
            'body': json.dumps(data),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
