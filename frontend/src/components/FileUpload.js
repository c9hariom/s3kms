import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {


    const [file, setFile] = useState(null)
    const [message, setMessage] = useState([])
    const [s3, setS3] = useState()
    const [mongo, setMongo] = useState()

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        let newMsg = ''
        setMessage(prevMessages => [...prevMessages, newMsg]);
    }

    const handleUpload = async () => {
        let newMsg = 'Please select a file to upload'
        if (!file) {
            let newMsg = 'Please select a file to upload'
            setMessage(prevMessages => [...prevMessages, newMsg]);
            return
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Add initial uploading message
            setMessage(prevMessages => [...prevMessages, 'file is uploading...']);

            const res = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'x-requested-with': 'react'
                }
            });

            // Replace the last message ("file is uploading...") with server message
            setMessage(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length] = res.data.message; // e.g. "File uploaded to s3 and deleted from Server"
                return newMessages;
            });

            // Update your other states
            setMongo(res.data.newFile);
            setS3(res.data.s3Response);

            // Optionally add any other message you want after success
            setMessage(prevMessages => [...prevMessages, 'file successfully uploaded']);
        } catch (error) {
            newMsg = 'X=> Upload failed '
            console.log('Upload error:', error);
            setMessage(prevMessages => [...prevMessages, newMsg]);
        }
    }


    return (

        <>
            <div className="container py-5">
                <div className="row justify-content-center mb-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                            <div className="card-body text-center p-4">
                                <h4 className="card-title mb-4">Upload File</h4>
                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                            <div className="card-body text-center p-4" style={{ height: "300px" }}>
                                <h4 className="card-title mb-4">Message</h4>
                                <textarea
                                    value={message.join('\n')}
                                    disabled
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        fontSize: "12px",
                                        resize: "none",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        padding: "10px"
                                    }}
                                />
                            </div>
                        </div>


                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                            <div className="card-body p-4">
                                <h4 className="card-title mb-4">MongoDB Response</h4>
                                <pre className="bg-light p-3 rounded text-start overflow-auto" style={{

                                    fontSize: "12px",
                                    resize: "none",
                                    backgroundColor: "#f8f9fa",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "10px"
                                }}>
                                    {mongo ? JSON.stringify(mongo, null, 2) : 'No data yet.'}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                            <div className="card-body p-4">
                                <h4 className="card-title mb-4">S3 Response</h4>
                                <pre style={{

                                    fontSize: "12px",
                                    resize: "none",
                                    backgroundColor: "#f8f9fa",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "10px"
                                }} className="bg-light p-3 rounded text-start overflow-auto" >
                                    {s3 ? JSON.stringify(s3, null, 2) : 'No response yet.'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default FileUpload;
