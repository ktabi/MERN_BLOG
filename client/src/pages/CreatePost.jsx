import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

// for React-quill formating
const modules ={
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

function CreatePost() {
    //we want to send the whole form as form data becuase of the attachment file.
    //won't make sense sending the whole things as json
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    // Function create New Post
   async function createNewPost(e) {
       //creating a new form data to aid in uploading images
       e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        const response = await fetch('http://localhost:3001/post', {
            method: 'POST',
            body: data, 
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
       return <Navigate to={'/'} />
    }

  return (
    <form onSubmit={createNewPost}>
        <input type="title"  
            placeholder={'Title'} 
            value={title} 
            onChange={ev => setTitle(ev.target.value)} />

        <input type="summary"  
            placeholder={'Summary'} 
            value={summary} 
            onChange={ev => setSummary(ev.target.value)}/>

        <input type="file" 
            onChange={ev => setFiles(ev.target.files)} />
        {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
        <ReactQuill 
            value={content} 
            onChange={newValue => setContent(newValue)} 
            modules={modules} 
            formats={formats} />
        <button style={{marginTop: '5px'}}> Create Post</button>
    </form>
  )
}

export default CreatePost