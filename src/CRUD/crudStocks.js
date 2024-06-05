import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrudStocks() {
    const [posts, setPosts] = useState([]);
    const [ticker, setticker] = useState('');
    const [id, setId] = useState('');
    const [org, setorg] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [errors, setErrors] = useState({});

    //Validating Form
    const validateForm = () => {
        const errors = {};
        let isValid = true;
 
        if (!ticker.trim()) {
            errors.ticker = "Ticker information is required";
            isValid = false;
        }
 
        if (!org.trim()) {
            errors.org = "Organization information is required";
            isValid = false;
        }
 
        if (!id) {
            errors.id = "ID is required";
            isValid = false;
        } else if (!/^\d+$/.test(id)) {
            errors.id = "ID must be a valid number";
            isValid = false;
        }
 
        setErrors(errors);
        return isValid;
    };

    //Fetch Data
    useEffect(() => {
        axios.get('http://localhost:8888/stock/read')
          .then(response => {
            setPosts(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the posts!', error);
          });
      });

      // Create a new post
    const createPost = () => {
        if (!validateForm()) return;
        axios.post('http://localhost:8888/stock/add', {
            id,
          ticker,
          org,
        })
        .then(response => {
          setPosts([...posts, response.data]);
          setId('')
          setticker('');
          setorg('');
        })
        .catch(error => {
          console.error('There was an error creating the post!', error);
        });
    };

    // Update a post
    const updatePost = (post) => {
        if (!validateForm()) return;
        axios.put(`http://localhost:8888/stock/update/${post.id}`, post)
          .then(response => {
            setPosts(posts.map(p => (p.id === post.id ? response.data : p)));
            setEditingPost(null);
            setId('')
            setticker('');
            setorg('');
          })
          .catch(error => {
            console.error('There was an error updating the post!', error);
          });
    };

    // Delete a post
    const deletePost = (id) => {
        axios.delete(`http://localhost:8888/stock/delete/${id}`)
          .then(() => {
            setPosts(posts.filter(post => post.id !== id));
          })
          .catch(error => {
            console.error('There was an error deleting the post!', error);
          });
    };
    
    const handleEditClick = (post) => {
        setEditingPost(post);
        setId(post.id);
        setticker(post.ticker);
        setorg(post.org);
      };
    
    const handleSaveClick = () => {
        if (editingPost) {
          updatePost({id, ticker, org });
        } else {
          createPost();
        }
    };
    
    

    return (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">
              <h1>CRUD using Axios</h1>
              <div className="mb-3 mt-5">
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control border border-secondary ${errors.id && 'is-invalid'}`}
                  style={{ maxWidth: '400px' }}
                  placeholder="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                {errors.id && <div className="invalid-feedback">{errors.id}</div>}
              </div>
                <input
                  type="text"
                  className={`form-control border border-secondary ${errors.ticker && 'is-invalid'}`}
                  style={{ maxWidth: '400px' }}
                  placeholder="ticker"
                  value={ticker}
                  onChange={(e) => setticker(e.target.value)}
                />
                {errors.ticker && <div className="invalid-feedback">{errors.ticker}</div>}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control border border-secondary ${errors.org && 'is-invalid'}`}
                  style={{ maxWidth: '400px' }}
                  placeholder="Organization"
                  value={org}
                  onChange={(e) => setorg(e.target.value)}
                />
                {errors.org && <div className="invalid-feedback">{errors.org}</div>}
              </div>
              <div>
                <button className="btn btn-success" onClick={handleSaveClick}>
                  {editingPost ? 'Update Stock  info' : 'Create new Stock'}
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <h2>Stock List</h2>
              <ul className="list-group border border-secondary">
                {posts.map(post => (
                    post && (
                  <li key={post.id} className="list-group-item">
                    <div>
                      <h5>Stock ID: {post.id}</h5>
                      <p>Stock Ticker: {post.ticker}</p>
                      <p>Stock Organization: {post.org}</p>
                      
                      <button className="btn btn-lg btn-outline-warning me-1" onClick={() => handleEditClick(post)}>Edit</button>
                      <button class="btn btn-lg btn-outline-danger" onClick={() => deletePost(post.id)}><i class="bi bi-trash"></i>Delete</button>
                    </div>
                  </li> )
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
}

export default CrudStocks;