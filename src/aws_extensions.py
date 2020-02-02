import boto3

s3 = boto3.resource('s3')

def all_objects_from_bucket(bucketName):
    bucket = s3.Bucket(bucketName)
    return bucket.objects

def objects_from_bucket_per_page(bucketName, page_size):
    return s3.Bucket(bucketName).objects.page_size(page_size)

def count_objects(objects):
    count=0
    for x in objects.all(): 
        count+=1
    return count

def get_object_summary(bucket, key):
    return s3.ObjectSummary(bucket, key)

def data_from_object(bucketName, key):
    obj = s3.Object(bucketName,key)
    return obj.content_type

def link_from_object(bucketName, key):
    return 'https://%s.s3.amazonaws.com/%s' % (bucketName, key)

def delete_object_if_exists(bucketName, key):
    obj = s3.Object(bucketName,key)

    if obj is None:
        return
    
    obj.delete()
