import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PrivacyPolicy = () => {
  const [value, setValue] = useState('');

  console.log(value);


  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
}

export default PrivacyPolicy