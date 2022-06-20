/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';

import Table from '../components/DashBoard/table/Table';
import GlobalLoading from 'components/UI/GlobalLoading';
import sentenceApi from 'apis/sentenceApi';
import Avatar from '@material-ui/core/Avatar';

const perPage = 622;
const Centences = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  console.log('list', list);
  const [topicList, setTopicList] = useState([]);
  const totalPage = useRef(0);
  const preSearchList = useRef([]);

  // get total sentence
  useEffect(() => {
    let isSub = true;
    // const getTotal = async () => {
    //   const apiRes = await sentenceApi.getTotalSentences(topicList);
    //   console.log({ apiRes });
    //   if (apiRes.status === 200 && isSub) {
    //     const { total = 0 } = apiRes.data;
    //     totalPage.current = Math.ceil(total / perPage);
    //   }
    // }
    // getTotal();
    (async function () {
      try {
        const apiRes = await sentenceApi.getTotalSentences(topicList);
        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          totalPage.current = Math.ceil(total / 20);
        }
      } catch (error) { }
    })();

    return () => (isSub = false);
  }, [topicList]);

  // get sentence list
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);
        const apiRes = await sentenceApi.getSentenceList(
          page,
          perPage,
          topicList,
        );

        if (apiRes.status === 200 && isSub) {
          const { sentenceList = [] } = apiRes.data;
          setList([...list, ...sentenceList]);
        }
      } catch (error) {
      } finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [page, topicList]);

  const customerTableHead = [
    '',
    'sentence',
    'note',
    'mean',
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
        <td>{item.sentence}</td>
        <td>{item.note}</td>
        <td>{item.mean}</td>
    </tr>
);
    return (
      <div>
        {
          loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
                      <h2 className="page-header">
                Centences
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='150'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={list}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                    </div>
                    </div>
                </div>
            </div>
          </>
        }
        </div>
    );
};

export default Centences;
