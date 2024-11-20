/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUserChats = /* GraphQL */ `
  query ListUserChats($username: String!) {
    listUserChats(username: $username) {
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
export const getChatRoomMessages = /* GraphQL */ `
  query GetChatRoomMessages($chatRoomId: ID!, $limit: Int, $nextToken: String) {
    getChatRoomMessages(
      chatRoomId: $chatRoomId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getChatRoomByUsers = /* GraphQL */ `
  query GetChatRoomByUsers($user1: String!, $user2: String!) {
    getChatRoomByUsers(user1: $user1, user2: $user2) {
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
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        displayName
        friends
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
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
export const listChatRooms = /* GraphQL */ `
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatRoomId
        user1
        user2
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
