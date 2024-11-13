/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addFriend = /* GraphQL */ `
  mutation AddFriend($userEmail: String!, $friendEmail: String!) {
    addFriend(userEmail: $userEmail, friendEmail: $friendEmail)
  }
`;
export const unfriend = /* GraphQL */ `
  mutation Unfriend($userEmail: String!, $friendEmail: String!) {
    unfriend(userEmail: $userEmail, friendEmail: $friendEmail)
  }
`;
export const updateMessageStatus = /* GraphQL */ `
  mutation UpdateMessageStatus($messageId: ID!, $status: MessageStatus!) {
    updateMessageStatus(messageId: $messageId, status: $status) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
