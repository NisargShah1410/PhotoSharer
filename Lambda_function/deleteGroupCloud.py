import json
import boto3

dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
table_name = 'groupsCloud'

def delete_item(groupid):
    table = dynamodb.Table(table_name)
    response = table.delete_item(
        Key={
            'group_id': groupid
        }
    )
    return response

def lambda_handler(event, context):
    print(event['body'])
    data = json.loads(event["body"])
    print(data)
    groupid = data["id"]
    
    
    for image in data["images"]:
        s3_client.delete_object(Bucket='photostoragedata1', Key='uploads/'+image["image_id"])

    try:
        # Delete the team with the given group ID
        delete_response = delete_item(groupid)
        print(delete_response)

        return {
            'statusCode': 200,
            'body': json.dumps({"message": "Grou deleted successfully"}),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
    except Exception as e:
        return  {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
