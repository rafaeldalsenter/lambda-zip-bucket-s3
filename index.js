const AWS = require('aws-sdk');
const Archiver = require('archiver');
const stream = require('stream');
const s3 = new AWS.S3();
const streamPassThrough = new stream.PassThrough();

const uploadToS3 = (bucket, name) =>  
    s3.upload({ 
        Bucket: bucket, 
        Key: name, 
        Body: streamPassThrough 
    }, (error, data) => { 
        if (error) {
            throw error;
        }
    });

const listAllObjectsFromS3 = (params, out = []) => 
    new Promise((resolve, reject) => {
        s3.listObjectsV2(params)
            .promise()
            .then(({Contents, IsTruncated, NextContinuationToken}) => {
                Contents.forEach(content => out.push(content.Key));
                !IsTruncated ? resolve(out) : resolve(listAllObjectsFromS3(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
            })
            .catch(reject);
    });

exports.handler = async (event) => {

    let s3Objects = await listAllObjectsFromS3({ 
        Bucket: event.bucketNameSource
    });

    let archivesFromBucket = await Promise.all(
        s3Objects.map(archive => new Promise((resolve, reject) => {
            s3.getObject({ 
                Bucket: event.bucketNameSource, 
                Key: archive 
            }, (error, data) => {
                if(error){
                    throw error;
                }
                resolve({ data: data.Body, name: `${archive.split('/').pop()}` });
            });
        }))
    );

    var upload = uploadToS3(event.bucketNameDest, event.archiveName);	

    var archive = Archiver('zip');
    archive.on('error', err => { throw new Error(err); });

    await new Promise((resolve, reject) => {
        upload.on('close', resolve);
        upload.on('end', resolve);
        upload.on('error', reject);
        archive.pipe(streamPassThrough);	
        archivesFromBucket.forEach(item => archive.append(item.data, { name: item.name }));
        archive.finalize();
    }).catch(error => { throw error; });

    await upload.promise();
};
