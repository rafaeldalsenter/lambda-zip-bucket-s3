import json
import aws_extensions as aws_ext
from io import BytesIO
import zipfile

def function_return(success, message, link = None):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "success" : success,
            "message": message,
            "link": link
        })
    }

def lambda_handler(event, context):
    try:
        print('Started the Lambda function')

        bucketNameSource = event['bucket_name_source']
        bucketNameDest = event['bucket_name_dest']
        archiveNameDest = event['archive_name_dest']
        archivePublicAccess = event['archive_public_access']
        amountOfFilesToUpload = event['amount_of_files_to_upload']

        print('Source Bucket:', bucketNameSource)
        print('Target archive:', bucketNameDest + '/' + archiveNameDest)

        objects = aws_ext.all_objects_from_bucket(bucketNameSource)
        count_objects = aws_ext.count_objects(objects)
        amount_objects = amountOfFilesToUpload

        if(amount_objects == 0):
            amount_objects =  count_objects

        print("Source bucket files count:", count_objects)

        aws_ext.delete_object_if_exists(bucketNameDest, archiveNameDest)

        binary = BytesIO()

        for page in objects.page_size(amount_objects).pages():

            zip_file = aws_ext.get_object_summary(bucketNameDest, archiveNameDest)

            print("Upload +{} files to {}...".format(amount_objects, archiveNameDest))

            with zipfile.ZipFile(binary, mode="a",compression=zipfile.ZIP_DEFLATED) as zf:
                for x in page:
                    zf.writestr(x.key, x.get()['Body'].read())
            
            if(archivePublicAccess):
                zip_file.put(Body=binary.getvalue(), ACL='public-read')
            else:
                zip_file.put(Body=binary.getvalue()) 

        link = aws_ext.link_from_object(bucketNameDest, archiveNameDest)

        return function_return(True, "Bucket successfully compressed!", link)

    except KeyError as k_err:
        return function_return(False, "Parameter " + str(k_err) + " is invalid!")
    except Exception as err:
        return function_return(False, "Exception :" + str(err))
