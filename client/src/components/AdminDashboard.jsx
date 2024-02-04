import React, {useState, useEffect} from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axiosInstance from '../app/axiosInstance';

const AdminDashboard = () => {
    const [auditionCount, setAuditionCount] = useState([]);
    const [castingCallCount, setCastingCallCount] = useState(null)
    const [actorCount, setActorCount] = useState(null);
    const [directorCount, setDirectorCount] = useState(null);
    const [castingCallsByGenre, setCastingCallsByGenre] = useState([]);

    const castingCallsGenreWise = async () => {
        try {
            const {data} = await axiosInstance.get('/admin/dashboard/castingcallsbygenre',{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            setCastingCallsByGenre(data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const paymentsPerWeek = async () => {
        try {
            
        } catch (error) {
            
        }
    }

    const documentCount = async () => {
        try {
            const {data} = await axiosInstance.get('/admin/dashboard/actordirectorcount',{
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

    useEffect(()=>{
        documentCount()
        castingCallsGenreWise()
    },[])

  const pieChartData = {
    labels: castingCallsByGenre.map(item=>item._id),
    datasets: [
      {
        data: castingCallsByGenre.map(item=>item.count),
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
        
        {/* Pie Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Pie Chart</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Line Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Line Chart</h2>
          <Line data={lineChartData} />
        </div>

        {/* Bar Chart */}
        <div className="mb-8 px-80 py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Bar Chart</h2>
          <Bar data={barChartData} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

