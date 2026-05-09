import React, { useState } from 'react';
import client from './config/appwrite_config';
import { Storage, ID } from 'appwrite';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';

const storage = new Storage(client);

export default function Upload() {

    const [file, setFile] = useState(null)
    const bucketId = import.meta.env.VITE_BUCKET_ID;



    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        
       
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file.type.startsWith('image/')) {
            try {
                const response = await storage.createFile(bucketId, ID.unique(), file)
                console.log('Photo uploaded with success!', response)
                alert('Photo uploaded with success!')
            } catch (err) {
                console.log('File upload unsuccessful!', err)

            }
        } else {
            alert('Válassz ki fotot amit készitettél!')
        }
    }




    return (
        <>
            <div className='form_wrapper'>
                <form onSubmit={handleSubmit}>
                <h2 className='upload_title'>Töltsd fel a képeidet az eseményről!!</h2>
                    <label className='file' htmlFor="files" >válasz képét!</label>
                    <input id="files" onChange={handleFileChange} type="file" />
                    <button className='file' type='submit'>feltöltés<CloudUploadTwoToneIcon/></button>
                </form>
            </div>
        </>
    )
}