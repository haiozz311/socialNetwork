exports.addTopicsQuery = (topics, query) => {
  // query multiple topic
  if (topics.length > 0) {
    let orList = [];
    console.log("orList", orList)
    topics.forEach((topic) =>
      orList.push({ topics: { $elemMatch: { $eq: topic } } }),
    );
    console.log('topics',topics);
    console.log('orList',orList);
    query['$or'] = orList;
  }

  return query;
};

exports.convertPackInfoToQueryStr = (packInfo) => {
  const { topics, ...restPackInfo } = packInfo;
  const topicList = typeof topics === 'string' ? JSON.parse(topics) : topics;

  // generate query string
  let query = {};
  for (let key in restPackInfo) {
    if (packInfo[key] !== '-1') {
      query[key] = packInfo[key];
    }
  }

  // query multiple topic
  this.addTopicsQuery(topicList, query);

  return query;
};
