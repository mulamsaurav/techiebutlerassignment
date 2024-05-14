import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {fetchDataFromUrl} from './api/fetchData';

type PostDetailsParams = {
  postId: number;
};

const PostDetails: React.FC<PostDetailsParams> = ({postId}) => {
  const [postDetails, setPostDetails] = useState<Posts>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPostDetails = useCallback(async () => {
    console.log('PostDetails component re-rendered due to changes in props');
    try {
      setIsLoading(true);
      const response = await fetchDataFromUrl(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
      );
      setPostDetails(response);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching post details:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
      }}>
      <Text>Post Details</Text>
      {postDetails && !isLoading ? (
        <>
          <Text>Item ID: {postDetails.id}</Text>
          <Text numberOfLines={5}>Title: {postDetails.title}</Text>
          <Text numberOfLines={5}>Body: {postDetails.body}</Text>
        </>
      ) : (
        <View>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default PostDetails;
