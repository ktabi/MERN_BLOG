import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function PostDetails() {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:3001/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            })
        })
    }, []);

    if(!postInfo) return '';

    return (
        <div className='post-detail'>
        <h1>{postInfo.title}</h1>
        <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy')}</time>
        <div className='author'>by: @{postInfo.author.username}</div>
        <div className='image'>
        <img src={`http://localhost:3001/${postInfo.cover}`} alt="cover" />
        </div>

        {/* printing content as html from string */}
        <div dangerouslySetInnerHTML={{__html:postInfo.content}}/>

    </div>
  )
}

export default PostDetails