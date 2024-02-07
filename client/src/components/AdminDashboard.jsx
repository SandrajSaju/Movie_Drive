import React, { useState, useEffect } from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axiosInstance from '../app/axiosInstance';

const AdminDashboard = () => {
  const [auditionCount, setAuditionCount] = useState([]);
  const [castingCallCount, setCastingCallCount] = useState(null)
  const [actorCount, setActorCount] = useState(null);
  const [directorCount, setDirectorCount] = useState(null);
  const [castingCallsByGenre, setCastingCallsByGenre] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);

  const castingCallsGenreWise = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/dashboard/castingcallsbygenre', {
        headers: {
          "Authorization": localStorage.getItem("adminToken")
        }
      });
      setCastingCallsByGenre(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/dashboard/paymenthistory', {
        headers: {
          "Authorization": localStorage.getItem("adminToken")
        },
        params:{
          fromDate:fromDate,
          toDate:toDate
        }
      });
      setPaymentHistory(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const documentCount = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/dashboard/actordirectorcount', {
        headers: {
          "Authorization": localStorage.getItem("adminToken")
        }
      });
      setActorCount(data.actors)
      setDirectorCount(data.directors)
      setAuditionCount(data.auditions)
      setCastingCallCount(data.castingCalls)
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPaymentHistory();
  };

  useEffect(() => {
    documentCount()
    castingCallsGenreWise()
  }, [])

  const pieChartData = {
    labels: castingCallsByGenre.map(item => item._id),
    datasets: [
      {
        data: castingCallsByGenre.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sample Line Chart',
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  const barChartData = {
    labels: ['Actors', 'Directors', 'Casting Calls', 'Auditions'],
    datasets: [
      {
        label: 'Sample Bar Chart with Total Counts',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [actorCount, directorCount, castingCallCount, auditionCount],
      },
    ],
  };

  return (
    <>
      <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
        <h1 className='text-3xl font-bold title-font text-gray-900 tracking-wider text-center mt-5'>Dashboard</h1>

        <h2 className="text-2xl font-bold mt-6 text-center">Compensation History</h2>
        <form onSubmit={handleSubmit} className="mb-8 px-80 py-10">
          <div className='flex justify-center items-center space-x-10'>
            <div className="flex items-center space-x-2">
              <label htmlFor="fromDate" className="text-lg font-medium">From Date:</label>
              <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="toDate" className="text-lg font-medium">To Date:</label>
              <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
          <div className='text-center'>
            <button type="submit" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-4">Submit</button>
          </div>
        </form>

        {
          paymentHistory.length !== 0 && <div className="mb-8 px-20 py-10">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Director Name</th>
                  <th className="px-4 py-2">Actor Name</th>
                  <th className="px-4 py-2">CastingCall</th>
                  <th className="px-4 py-2">Total Compensation</th>
                  <th className="px-4 py-2">Actor Revenue</th>
                  <th className="px-4 py-2">Admin Revenue</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(payment => (
                  <tr key={payment._id}>
                    <td className="border px-4 py-2 text-center">{payment.director.name}</td>
                    <td className="border px-4 py-2 text-center">{payment.actor.name}</td>
                    <td className="border px-4 py-2 text-center">{payment.audition.castingCall.castingCallTitle}</td>
                    <td className="border px-4 py-2 text-center">{payment.audition.castingCall.compensation}</td>
                    <td className="border px-4 py-2 text-center">{payment.id}</td>
                    <td className="border px-4 py-2 text-center">{payment.date}</td>
                    <td className="border px-4 py-2 text-center">{new Date(payment.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }

        {/* Pie Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Casting Call Genre Chart</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Line Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Line Chart</h2>
          <Line data={lineChartData} />
        </div>

        {/* Bar Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Overall Analytics</h2>
          <Bar data={barChartData} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

