import toast, { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';


const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState(null);
  const [results, setresults] = useState(null);
  const [faceMatch , setfaceMatch] = useState(null);

  let x = ''


  async function process() {
    try {
      const response = await fetch('https://bb0d-2409-4073-4e99-a76d-ed92-3f32-ab2f-3cb5.ngrok-free.app/capture', {
        method: 'POST', 
        headers: {
          
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: 'value' })
      });
     const responseData = await response.json();
      console.log('Capture Process Result:', responseData.image);
      setImageUrl(responseData.image)
      setImageData(responseData.imageData)
    } catch (error) {
      console.error('Error:', error.message);
    }
    
  };
  
  async function validateImage(){
    try {
      toast('Please Wait!', {
        duration:10000    
      });
      const response = await fetch('https://bb0d-2409-4073-4e99-a76d-ed92-3f32-ab2f-3cb5.ngrok-free.app/validate', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: `${imageUrl}` })
      });
     const responseData = await response.json();
      console.log('License Number :', responseData);
      setresults(responseData.result);
      const isLicense = await fectchData(responseData.result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  async function fectchData(LicenseNumber){
    try {
      console.log(LicenseNumber[0].value)
      const response = await fetch('https://my-json-server.typicode.com/deosaju/demo/posts', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const responseData = await response.json();
      console.log(responseData)
      for(let i=0; i<responseData.length; i++){
        if(responseData[i].id === LicenseNumber[0].value){
          console.log(responseData[i])
          toast.success('Number Plate Matches!')
          toast.success('Starting Facial Recognition!')
          const response = await fetch('https://bb0d-2409-4073-4e99-a76d-ed92-3f32-ab2f-3cb5.ngrok-free.app/face', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: `${responseData[i].title}` , key2: `${imageData}` })
          });
          const facialVerify = await response.json();
          console.log(facialVerify)
          if(facialVerify.result > '75'){
            toast.success('Facial Recognition Successful!')
            toast.success('Access Granted!')
            setfaceMatch(facialVerify.result)
            return
          }else{
            toast.error('Facial Recognition Failed!')
            toast.error('Access Denied!')
            return
          }          
        }else{
          toast.error('Number Plate Does Not Match!')
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        onClick={process}
      >
        Capture Image !
      </button>
      {imageUrl && (
        <img
          className="h-96 w-96 mt-4 rounded-lg"
          src={imageUrl}
          alt="Captured Image"
        />
      )}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow mt-4"
        onClick={validateImage}
      >
        Validate
      </button>
      {results && (
        <div className="mt-4 text-black text-center">
          <p>License No.: {results[0].value}</p>
          <p>Confidence: {results[0].confidence}</p>
          <p>Face Match Confidence: {faceMatch}</p>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default App;
