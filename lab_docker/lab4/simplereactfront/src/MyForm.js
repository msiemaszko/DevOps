import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyForm = props => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    // useEffect( () => {
    //     axios.post('/posts')
    // }, [])

    const handlerSubmit = event => {
        console.log(`Dane do wysłania: ${title} ${body}`);

        axios.post('https://jsonplaceholder.typicode.com/posts', {
            userId: 1,
            title: title,
            body: body
        })
        .then(response => {console.log(response)})
        .catch(error => console.log(error))

        event.preventDefault();
    }


    return (
        <div>
            <input type='text' value={title} onChange={event => setTitle(event.target.value)}/><br/>
            <input type='text' value={body} onChange={event => setBody(event.target.value)}/><br/>

            <input type='submit' value='OK' onClick={handlerSubmit}/>
        </div>
    );
}

export default MyForm;