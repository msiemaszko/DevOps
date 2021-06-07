import { useEffect, useState } from 'react';
import axios from 'axios';

const Post = props => {

    const [posts, setPosts] = useState([]);
    // const [number, setNumber] = useState(props.noPosts);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error))
    }, []);

    const handlePostClick = event => {

    }

    const handeleNumberChange = event => {
        // setNumber(event.target.value);
        props.changeParentHandler(event.target.value);
    }

    return(
        <>
        <div>
            {posts
                // .filter(post => post.title.startsWith('a'))
                .slice(0, props.noPosts)
                .map( post => (
                    <div key={post.id} onClick={handlePostClick}>{post.title}</div>
                )
            )}
        </div>
        <div>Number {props.noPosts}</div>
            <input onChange={handeleNumberChange} value={props.noPosts}/>
        </>
    )    
}

export default Post;