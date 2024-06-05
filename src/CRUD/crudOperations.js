import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrudOperations() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [editingPost, setEditingPost] = useState(null);

    //Fetch Data
    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
          .then(response => {
            setPosts(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the posts!', error);
          });
      }, []);

      // Create a new post
    const createPost = () => {
        axios.post('https://jsonplaceholder.typicode.com/posts', {
          title,
          body,
        })
        .then(response => {
          setPosts([...posts, response.data]);
          setTitle('');
          setBody('');
        })
        .catch(error => {
          console.error('There was an error creating the post!', error);
        });
    };

    // Update a post
    const updatePost = (post) => {
        axios.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post)
          .then(response => {
            setPosts(posts.map(p => (p.id === post.id ? response.data : p)));
            setEditingPost(null);
            setTitle('');
            setBody('');
          })
          .catch(error => {
            console.error('There was an error updating the post!', error);
          });
    };

    // Delete a post
    const deletePost = (id) => {
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
          .then(() => {
            setPosts(posts.filter(post => post.id !== id));
          })
          .catch(error => {
            console.error('There was an error deleting the post!', error);
          });
    };
    
    const handleEditClick = (post) => {
        setEditingPost(post);
        setTitle(post.title);
        setBody(post.body);
      };
    
    const handleSaveClick = () => {
        if (editingPost) {
          updatePost({ ...editingPost, title, body });
        } else {
          createPost();
        }
    };
    
    

    return (
        <div className="App">
          <h1>React Axios CRUD Example</h1>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button onClick={handleSaveClick}>
              {editingPost ? 'Update Post' : 'Add Post'}
            </button>
          </div>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <button onClick={() => handleEditClick(post)}>Edit</button>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default CrudOperations;