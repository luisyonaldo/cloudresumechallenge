import json
import os

import boto3
from botocore.exceptions import ClientError

# Get the service resource.
dynamodb = boto3.resource("dynamodb")

# set environment variable
TABLE_NAME = os.environ["TABLE_NAME"]
SITE_DOMAIN = os.environ["SITE_DOMAIN"]


def handler(event, context):
    table = dynamodb.Table(TABLE_NAME)

    views = table.update_item(
        Key={"siteDomain": SITE_DOMAIN,},
        # increase site views
        UpdateExpression="set views = views + :val",
        ExpressionAttributeValues={":val": 1,},
        ReturnValues="UPDATED_NEW",
    )

    return {
        "statusCode": 200,
        "body": views,
    }
