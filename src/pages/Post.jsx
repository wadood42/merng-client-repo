import React, { useState } from "react";
import "../styles/Post.css";
import "../styles/Comment.css";
// import moment from "moment";
import { Link } from "react-router-dom";
import { FaHeart, FaRegCommentDots, FaTrash } from "react-icons/fa";
import {
  FETCH_POSTS_QUERY,
  DELETE_POST,
  LIKE_POST,
  GET_POST,
} from "../queries/queries";
import { useMutation } from "@apollo/client";
import ClipLoader from "react-spinners";
import { format } from "timeago.js";

import Comment from "../components/Comment";
const Post = ({ post }) => {
  console.log("rendering post");
  const [showComments, setShowComments] = useState(false);
  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: (likedPost) => {
      console.log("liked post", likedPost);
    },
    onError: (err) => {
      console.log("err after liking post", err);
    },
    update: (cache, { data }) => {
      console.log("result after liking", data.likePost);

      const newPostFromResponse = data?.likePost;
      const existingPosts = cache.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      console.log("existing posts", existingPosts);

      if (existingPosts && newPostFromResponse) {
        cache.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [...existingPosts?.getPosts, newPostFromResponse],
          },
        });
      }
    },
    variables: { postId: post.id },
    // refetchQueries: [{ query: GET_POST, variables: { postId: post.id } }],
  });
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    onCompleted: (deletedPost) => {
      console.log("deleted post", deletedPost);
    },
    onError: (err) => {
      console.log("error from deleting post", err);
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],

    variables: { postId: post.id },
  });

  return (
    <div className='post'>
      <div className='post-link'>
        <Link to={`/${post.author.id}`}>
          <p className='post-username'>{post.author.username}</p>
        </Link>
        <Link to={`/posts/${post.id}`} className='post-link'>
          <p className='post-created-at'>{format(post.createdAt)}</p>
          <p className='post-body'>{post.body.slice(0, 100)}...</p>
        </Link>
      </div>
      <div className='post-btns'>
        <div className='like-icon'>
          <span className='like' onClick={likePost}>
            <FaHeart color='red' size='12' />
          </span>
          <span style={{ fontSize: "0.8rem" }} className='like-counts'>
            {post.likes.length}
          </span>
        </div>
        <div className='comment-icon' onClick={() => setShowComments(true)}>
          <span className='comment'>
            <FaRegCommentDots size='12' />
          </span>
          <span className='comment-counts' style={{ fontSize: "0.8rem" }}>
            {post.comments.length}
          </span>
        </div>
        <div className='delete-btn' onClick={() => deletePost()}>
          <span className='delete-icon'>
            <FaTrash size='12' />
          </span>
        </div>
      </div>

      {showComments && <Comment post={post} />}
    </div>
  );
};

export default Post;
