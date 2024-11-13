import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {FlatGrid} from 'react-native-super-grid';
import {ListEmptyComponent} from '@app/layout';
import {UserCard} from '@app/layout';
import {AppContext} from '@app/context';
import {Routes} from '@app/constants';
import {SearchResult} from '@app/types/screens';

interface UserSearchResultsProps {
  searchResults: SearchResult[];
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  searchResults,
}) => {
  const {user} = useContext(AppContext);
  const {navigate} = useNavigation();
  const filteredSearchResults = [...searchResults].filter(
    result => result.id !== user.id,
  );

  const renderItem = ({item}) => {
    const {id, avatar, fullName, name} = item;
    return (
      <UserCard
        userId={id}
        avatar={avatar}
        fullName={fullName}
        name={name}
        onPress={() => {
          navigate('ProfileScreen', {user: item});
        }}
      />
    );
  };

  return (
    <FlatGrid
      itemDimension={responsiveWidth(85)}
      showsVerticalScrollIndicator={false}
      items={filteredSearchResults}
      ListEmptyComponent={() => (
        <ListEmptyComponent placeholder="No users found" spacing={60} />
      )}
      style={styles.container}
      spacing={20}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: responsiveWidth(100),
  },
});

export default UserSearchResults;
