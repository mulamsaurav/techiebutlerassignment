import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {fetchDataFromUrl} from './api/fetchData.ts';
import PostDetails from './PostDetails.tsx';

const {width, height} = Dimensions.get('screen');
const App = () => {
  const [postData, setPostData] = useState<Posts[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    (async () => {
      fetchDataFromUrl(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
      )
        .then((data: Posts[]) => {
          setPostData(data);
        })
        .catch(error => {
          console.error('Failed to fetch data:', error.message);
        });
    })();
  }, [page]);

  // Heavy computation function using useMemo
  const computeDetails = useMemo(() => {
    return (item: any) => {
      const startTime = Date.now();
      const computedDetails = {
        characterCount: item?.title.length,
      };
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log('Time taken for heavy computation:', timeTaken + 'ms');
      return computedDetails;
    };
  }, []);

  const handlePostClick = useCallback((postId: number) => {
    setSelectedPostId(postId);
  }, []);

  const renderPostItems = ({item}: {item: Posts}) => {
    const details = computeDetails(item);
    return (
      <TouchableOpacity
        style={{margin: 5}}
        onPress={() => handlePostClick(item.id)}>
        <Text style={{color: 'black', fontSize: 14}}>Id :{item?.id}</Text>
        <Text>Title : {item?.title}</Text>
        <Text>Characters : {details.characterCount}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    const disable = postData.length === 0;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: height * 0.3,
          width: width * 0.6,
          alignSelf: 'center',
        }}>
        <Text
          disabled={page === 1}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            color: 'black',
          }}
          onPress={() => setPage(prev => prev - 1)}>
          Back
        </Text>
        <Text>{page}</Text>
        <Text
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            color: 'black',
          }}
          disabled={disable}
          onPress={() => setPage(prev => prev + 1)}>
          Next
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{marginHorizontal: 10}}>
      {selectedPostId > 0 && postData.length > 0 && (
        <PostDetails postId={selectedPostId} />
      )}
      <FlatList
        data={postData}
        renderItem={renderPostItems}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              marginTop: height * 0.3,
            }}>
            No data found.
          </Text>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: 'grey',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 5,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default App;
