import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Massage from './Massage'
import Progress from './Progress';
// import { useHistory , useLocation} from "react-router-dom";



const FileUpload = () => {
    // const history = useHistory();
    // const location = useLocation();

    const [file , setFile] = useState('');
    const [fileName , setFileName] = useState('Choose File');
    const [uploadedFile , setUploadedFile] = useState({});
    const [massage , setMassage] = useState('')
    const [uploadPercentage, setUploadPercentage] = useState(0);



    const fileChangeHandle = e  =>{
        setFile(e.target.files[0])
        setFileName(e.target.files[0].name)
    }

    const fileSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file' , file);

        try {
            const res = await axios.post('upload' , formData , {
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(parseInt
                        (
                        Math.round((progressEvent.loaded * 100 ) / progressEvent.total)
                        )
                    );
                    // setUploadPercentage(
                    //   parseInt(
                    //     Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    //   )
                    // );
                    // Clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);
                  }
            })
            const { fileName , filePath } = res.data;
            setUploadedFile({fileName, filePath})
            setMassage('Fill uploaded')
        } catch (error) {
            if (error.response.status === 500) {
                setMassage('there was a problem with the server');
            } else {
                setMassage('error.response.data.msg');
            }
        }
    
    }
    
    // useEffect(() => {
    //     if(uploadPercentage === 0){
    //         window.location.reload()
    //     }
    // } , [uploadPercentage])

    return (
        <div>
            {massage && <Massage msg={massage} />}
            <form onSubmit={fileSubmit}>
                <div className='custom-file mb-4'>
                    <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={fileChangeHandle}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {fileName} 
                    </label>
                </div>

                <Progress percentage = {uploadPercentage} />

                <input 
                type = 'submit' 
                value = 'upload'
                className='btn btn-primary btn-block mt-4' 
                />
            </form>

            {
                uploadedFile ?
                    <div className='row mt-5'>
                        <div className="col-md-6 m-auto">
                            <h3 className='text-center'>{uploadedFile.fileName}</h3>
                            <img style={{width : '100%' , height : '100%'}} src={uploadedFile.filePath} alt=""/>
                        </div>

                    </div> : null
            }
        </div>
    );
};

export default FileUpload;