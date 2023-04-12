import Axios from 'axios';

export async function uploadFile(file, preSignedUrl) {
  try {
    const headers = {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read',
      'Access-Control-Allow-Origin': '*',
    };

    await Axios.put(preSignedUrl, file, {headers});
  } catch (error) {
    console.log(error);
    console.log('Something went wrong.');
  }
}
