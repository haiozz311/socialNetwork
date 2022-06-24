import React, {useEffect, useState, useRef } from 'react';

import { Link } from 'react-router-dom';

import Chart from 'react-apexcharts';

import { useSelector } from 'react-redux';

import StatusCard from 'components/DashBoard/status-card/StatusCard';

import Table from 'components/DashBoard/table/Table';

import Badge from 'components/DashBoard/badge/Badge';
import GlobalLoading from 'components/UI/GlobalLoading';

import sentenceApi from 'apis/sentenceApi';
import commonApi from 'apis/commonApi';
import accountApi from 'apis/accountApi';
import postApi from 'apis/postApi';

const chartOptions = {
    series: [{
        name: 'Word',
        data: [40, 70, 20, 90, 36, 80, 30, 91, 60, 10, 12, 13]
    }, {
        name: 'Store Customers',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10, 12, 13]
    }],
    options: {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec']
        },
        legend: {
            position: 'top'
        },
        grid: {
            show: false
        }
    }
};

const renderCusomerHead = (item, index) => (
    <th key={index}>{item}</th>
);

const renderCusomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.name}</td>
        <td>{item.coin}</td>
        <td>{item.authType === 'gg' ? 'Gmail' : item.authType === 'fb' ? 'Facebook': 'Local'}</td>
        <td>{item.email}</td>
    </tr>
);

const latestOrders = {
    header: [
        'order id',
        'user',
        'total price',
        'date',
        'status'
    ],
    body: [
        {
            id: '#OD1711',
            user: 'john doe',
            date: '17 Jun 2021',
            price: '$900',
            status: 'shipping'
        },
        {
            id: '#OD1712',
            user: 'frank iva',
            date: '1 Jun 2021',
            price: '$400',
            status: 'paid'
        },
        {
            id: '#OD1713',
            user: 'anthony baker',
            date: '27 Jun 2021',
            price: '$200',
            status: 'pending'
        },
        {
            id: '#OD1712',
            user: 'frank iva',
            date: '1 Jun 2021',
            price: '$400',
            status: 'paid'
        },
        {
            id: '#OD1713',
            user: 'anthony baker',
            date: '27 Jun 2021',
            price: '$200',
            status: 'refund'
        }
    ]
};

const orderStatus = {
    'shipping': 'primary',
    'pending': 'warning',
    'paid': 'success',
    'refund': 'danger'
};

const renderOrderHead = (item, index) => (
    <th key={index}>{item}</th>
);

const renderOrderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.user}</td>
        <td>{item.price}</td>
        <td>{item.date}</td>
        <td>
            <Badge type={orderStatus[item.status]} content={item.status}/>
        </td>
    </tr>
);

const Dashboard = () => {
  const [totalCentence, setTotalCentence] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalWork, setTotalWork] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const statusCards = [
    {
        icon: 'bx bx-user',
        count: totalUser,
        title: 'Total sales'
    },
    {
        icon: 'bx bx-list-ul',
        count: totalCentence,
        title: 'Centences'
    },
    {
        icon: 'bx bxs-layout',
        count: totalWork,
        title: 'Words'
    },
    {
        icon: 'bx bx-receipt',
        count: totalPost,
        title: 'Posts'
    }
  ];
  const topCustomers = {
    head: [
        'user',
        'icon',
        'status',
        'gmail'
    ],
    body: user,
};
  // get total sentence
  useEffect(() => {
    let isSub = true;
    (async function () {
      try {
        setLoading(true);
        const apiRes = await sentenceApi.getTotalSentences([]);
        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          setTotalCentence(total);
        }
        const params = {'type':'-1','level':'-1','specialty':'-1','topics':[]};
        const apiRes1 = await commonApi.getWordPackTotal(params);
        if (apiRes1.status === 200 && isSub) {
          const { total = 0 } = apiRes1.data;
          setTotalWork(total);
        }
        const apiRes2 = await accountApi.getTotalUser();
        if (apiRes2.status === 200 && isSub) {
          const { users } = apiRes2.data;
          setTotalUser(users.length);
          users.sort(function(a , b) {
            return b.coin - a.coin;
          });
          setUser(users);
        }
        const apiRes3 = await postApi.getTotalPost();
        if (apiRes3.status === 200 && isSub) {
          const { total = 0 } = apiRes3.data;
          setTotalPost(total);
        }
      } catch (error) { }
      finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, []);

    // const themeReducer = useSelector(state => state.ThemeReducer.mode);
  const themeReducer = 'theme-mode-dark';
  return (
    <div>
      {
        loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> :       <div>
        <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {
                            statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={item.count}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* chart */}
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...chartOptions.options,
                                theme: { mode: 'dark'}
                            } : {
                                ...chartOptions.options,
                                theme: { mode: 'light'}
                            }}
                            series={chartOptions.series}
                            type='line'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card__header">
                            <div className='title'>top customers</div>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={topCustomers.head}
                                renderHead={(item, index) => renderCusomerHead(item, index)}
                                bodyData={topCustomers.body}
                                renderBody={(item, index) => renderCusomerBody(item, index)}
                            />
                        </div>
                        {/* <div className="card__footer">
                            <Link to='/'>view all</Link>
                        </div> */}
                    </div>
                </div>
            </div>
    </div>
      }
  </div>
    );
};

export default Dashboard;
