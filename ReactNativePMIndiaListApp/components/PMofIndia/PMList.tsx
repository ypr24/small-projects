import React,{useState} from 'react';
import { SafeAreaView,Image, View, VirtualizedList, StyleSheet, Text, StatusBar } from 'react-native';

const PMofIndiaInfoList = [
    {
        name:"Jawaharlal Nehru",
        term:"15 August, 1947 - 15 April, 1952 15 April, 1952 - 17 April, 1957 17 April, 1957 - 2 April, 1962 2 April, 1962 - 27 May, 1964"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Jawaharlal-Nehru.jpg"
    },
    {
        name:"Gulzarilal Nanda (acting)",
        term:"27 May, 1964 - 9 June, 1964 11 January, 1966 - 24 January, 1966"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Gulzarilal-Nanda.jpg"
    },
    {
        name:"Lal Bahadur Shastri",
        term:"9 June, 1964 - 11 January, 1966"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Lal-Bahadur-Shastri.jpg"
    },
    {   
        name:"Indira Gandhi",
        term:"24 January, 1966 - 4 March, 1967 4 March, 1967 - 15 March, 1971 15 March, 1971 - 24 March, 1977 14 January, 1980 - 31 October, 1984"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Indira-Gandhi.jpg"
    },
    {
        name:"Morarji Desai",
        term:"24 March, 1977 - 28 July, 1979"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Morarji-Desai.jpg"
    },
    {
        name:"Charan Singh",
        term:"28 July, 1979 - 14 January, 1980"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Charan-Singh.jpg"
    },
    {
        name:"Rajiv Gandhi",
        term:"31 October, 1984 - 31 December, 1984 31 December, 1984 - 2 December, 1989"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Rajiv-Gandhi.jpg"
    },
    {
        name:"Vishwanath Pratap Singh",
        term:"2 December, 1989 - 10 November, 1990"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Vishwanath-Pratap-Singh.jpg"
    },
    {
        name:"Chandra Shekhar",
        term:"10 November, 1990 - 21 June, 1991"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Chandra-Shekhar.jpg"
    },
    {
        name:"PV Narsimha Rao",
        term:"21 June, 1991 - 16 May, 1996"
        ,url:"https://images.oneindia.com/elections/prime-ministers/P-V-Narasimha-Rao.jpg"
    },
    {
        name:"Atal Bihari Vajpayee",
        term:"16 May, 1996 - 1 June, 1996 19 March, 1998 - 10 October, 1999 10 October, 1999 - 22 May, 2004"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Atal-Bihari-Vajpayee.jpg"
    },
    {
        name:"HD Dave Godwa",
        term:"1 June, 1996 - 21 April, 1997"
        ,url:"https://images.oneindia.com/elections/prime-ministers/H-D-Deve-gowda.jpg"
    },
    {
        name:"IK Gujral",
        term:"21 April, 1997 - 19 March, 1998",
        url:"https://images.oneindia.com/elections/prime-ministers/Inder-Kumar-Gujral.jpg"
    },
    {
        name:"Manmohan Singh",
        term:"22 May, 2004 - 22 May, 2009 22 May, 2009 - 26 May, 2014"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Manmohan-Singh.jpg"
    },
    {
        name:"Narendra Modi",
        term:"26 May, 2014 - 26 May, 2019 26 May, 2019 - Till date"
        ,url:"https://images.oneindia.com/elections/prime-ministers/Narendra-Modi.jpg"
    },
]

const getItem = (data, index) => ({
  id: Math.random().toString(12).substring(0),
  title: PMofIndiaInfoList[index].name,
  term: PMofIndiaInfoList[index].term,
  url:PMofIndiaInfoList[index].url
});

const getItemCount = () => PMofIndiaInfoList.length;


const Item = ({ title, term, url }) => {
    const imgurl =  url
    return (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <br />
    <Image
    style={{width: 150, height: 150}} 
        source={{
          uri: imgurl,
        }}
      />
      <br />
    <Text >{term}</Text>
    

  </View>
)};

const PMList = () => {


  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedList
        data={PMofIndiaInfoList}
        initialNumToRender={50}
        renderItem={({ item }) => <Item title={item.title} term={item.term} url={item.url} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#fafafa',
    height: 350,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PMList;
