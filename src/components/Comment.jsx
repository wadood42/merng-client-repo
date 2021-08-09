import React, { useState, useContext } from "react";
import { ADD_COMMENT, GET_POST, GET_USER } from "../queries/queries";
import { useMutation } from "@apollo/client";

const Comment = ({ post }) => {
  console.log("rendering comment");
  const [commentBody, setCommentBody] = useState("");

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: (newComment) => {
      console.log("here is new comment", newComment);
    },
    onError: (err) => {
      console.log("error commenting", err);
    },

    update: (cache, { data }) => {
      console.log("result after commenting", data.getUser);

      const userFromResponse = data?.getUser;
      const existingUser = cache.readQuery({
        query: GET_USER,
        variables: { userId: data?.getUser.id },
      });

      console.log("userFromResponse", userFromResponse);
      console.log("existing user", existingUser);
    },

    variables: { postId: post.id, body: commentBody },

    // refetchQueries: [{ query: GET_POST, variables: { postId: post.id } }],
  });

  return (
    <div className='post-comments'>
      {post.comments?.map((comment) => (
        <div key={comment.id}>
          <p>{comment.body}</p>
        </div>
      ))}

      <div className='comment-form'>
        <form onSubmit={addComment}>
          <textarea
            type='text'
            value={commentBody}
            placeholder='comment here...'
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <input type='submit' value='Comment' />
        </form>
      </div>
    </div>
  );
};

export default Comment;
