import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table_name = 'groupsCloud'
storeGroup = dynamodb.Table(table_name)

def lambda_handler(event, context):
    response = store_group(json.loads(event['body']))
    return response


def store_group(request_body):
    try:
        storeGroup.put_item(Item=request_body)
        body = {
            'Operation': 'Store',
            'Message': 'Success',
            'Item': request_body
        }
        return build_response(200, body)
    except Exception as e:
        print(e)
        return build_response(500, {'Message': 'Error storing team data.'})


def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST',
        },
    }
