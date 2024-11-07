import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';

const unfriend = /* GraphQL */ `
  mutation Unfriend($friendEmail: String!) {
    unfriend(friendEmail: $friendEmail)
  }
`;

const FriendListItem = ({ friend, onUnfriend }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnfriend = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.graphql(graphqlOperation(unfriend, { friendEmail: friend.email }));
      if (data.unfriend) {
        console.log('Successfully unfriended');
        onUnfriend(friend.email);
      } else {
        console.log('Failed to unfriend');
        setError('Failed to unfriend. Please try again.');
      }
    } catch (error) {
      console.error('Error unfriending:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="friend-item">
      <span className="friend-name">{friend.displayName || friend.username}</span>
      <button
        className="unfriend-button"
        onClick={handleUnfriend}
        aria-label="Unfriend"
        disabled={loading}
      >
        {loading ? 'Removing...' : '✖'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FriendListItem;
