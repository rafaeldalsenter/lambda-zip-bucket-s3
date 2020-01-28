const AWS = require('aws-sdk');
const Archiver = require('archiver');
const stream = require('stream');
const s3 = new AWS.S3();


const uploadToStream = (bucket, name) => {
	let pass = new stream.PassThrough();
    
    s3.upload({ 
        Bucket: bucket, 
        Key: name, 
        Body: pass 
    }, (error, data) => { 
        if (error) {
            throw error;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
    
    return pass;
};

const listAllKeys = (params, out = []) => 
    new Promise((resolve, reject) => {
        s3.listObjectsV2(params)
            .promise()
            .then(({Contents, IsTruncated, NextContinuationToken}) => {
                Contents.forEach(content => out.push(content.Key));
                !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
            })
            .catch(reject);
    });

exports.handler = async (event) => {
    
    var bucketNameSource = 'rafaeldalsenter-teste';
    var bucketName = 'rafaeldalsenter-teste';
    var archiveName = 'teste' + '.zip';
    
    
    let params = { 
        Bucket: bucketNameSource
    }
    
    let s3Objects = await listAllKeys(params);

    var listArchivesFromBucket = await Promise.all(
            s3Objects.map(archive => new Promise((resolve, reject) => {
                s3.getObject({ 
                    Bucket: bucketNameSource, 
                    Key: archive 
                })
                .then(data => resolve({ data: data.Body, name: `${archive.split('/').pop()}` }));
            }
            )))
            .catch(error => { console.log(error); });


    // let listArchivesFromBucket = await Promise.all(s3Objects)
    //     .then(results => 
    //         results.forEach(archive => {
    //             s3.getObject({ 
    //                 Bucket: bucketNameSource, 
    //                 Key: archive 
    //             }, (error, data) => {
    //                 if (error) {
    //                     throw error;
    //                 }
    //                 resolve({ data: data.Body, name: `${archive.split('/').pop()}` });
    //             })
    //         })
    //     )
    //     .catch(error => { throw error });

    console.log('Arquivos:');
    console.log(listArchivesFromBucket);
    listArchivesFromBucket.forEach(item => console.log(item));
    
    // var listArchivesFromBucket = await Promise.all(
    //         s3Objects.map(archive => new Promise((resolve, reject) => {
    //             s3.getObject({ Bucket: bucketNameSource, Key: archive })
    //                 .then(data => resolve({ data: data.Body, name: `${archive.split('/').pop()}` }));
    //         }
    //         )))
    //         .catch(error => { console.log(error); });
            
    // await new Promise((resolve, reject) => {
    //     var myStream = uploadToStream(bucketName, archiveName);	
    //     var archive = Archiver('zip');
    //     archive.on('error', err => { throw new Error(err); });

    //     myStream.on('close', resolve);
    //     myStream.on('end', resolve);
    //     myStream.on('error', reject);

    //     archive.pipe(myStream);	
    //     listArchivesFromBucket.forEach(item => archive.append(item.data, { name: item.name }));
    //     archive.finalize();
    // }).catch(error => { console.log(error); });
    
};
