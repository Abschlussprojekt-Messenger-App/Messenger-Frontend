/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onNewMessage = /* GraphQL */ `
  subscription OnNewMessage($chatRoomId: ID!) {
    onNewMessage(chatRoomId: $chatRoomId) {
      id
      username
      message
      receiverUsername
      createdAt
      status
      chatRoomId
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $username: String
  ) {
    onCreateUser(filter: $filter, username: $username) {
      id
      username
      email
      displayName
      friends
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $username: String
  ) {
    onUpdateUser(filter: $filter, username: $username) {
      id
      username
      email
      displayName
      friends
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $username: String
  ) {
    onDeleteUser(filter: $filter, username: $username) {
      id
      username
      email
      displayName
      friends
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $receiverUsername: String
  ) {
    onCreateMessage(filter: $filter, receiverUsername: $receiverUsername) {
      id
      username
      message
      receiverUsername
      createdAt
      status
      chatRoomId
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $receiverUsername: String
  ) {
    onUpdateMessage(filter: $filter, receiverUsername: $receiverUsername) {
      id
      username
      message
      receiverUsername
      createdAt
      status
      chatRoomId
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $receiverUsername: String
  ) {
    onDeleteMessage(filter: $filter, receiverUsername: $receiverUsername) {
      id
      username
      message
      receiverUsername
      createdAt
      status
      chatRoomId
      updatedAt
      __typename
    }
  }
`;
export const onCreateChatRoom = /* GraphQL */ `
  subscription OnCreateChatRoom(
    $filter: ModelSubscriptionChatRoomFilterInput
    $user1: String
    $user2: String
  ) {
    onCreateChatRoom(filter: $filter, user1: $user1, user2: $user2) {
      id
      chatRoomId
      user1
      user2
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateChatRoom = /* GraphQL */ `
  subscription OnUpdateChatRoom(
    $filter: ModelSubscriptionChatRoomFilterInput
    $user1: String
    $user2: String
  ) {
    onUpdateChatRoom(filter: $filter, user1: $user1, user2: $user2) {
      id
      chatRoomId
      user1
      user2
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteChatRoom = /* GraphQL */ `
  subscription OnDeleteChatRoom(
    $filter: ModelSubscriptionChatRoomFilterInput
    $user1: String
    $user2: String
  ) {
    onDeleteChatRoom(filter: $filter, user1: $user1, user2: $user2) {
      id
      chatRoomId
      user1
      user2
      createdAt
      updatedAt
      __typename
    }
  }
`;
