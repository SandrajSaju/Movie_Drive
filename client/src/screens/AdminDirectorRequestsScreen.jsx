import React,{useState,useEffect} from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import AdminDirectorRequests from '../components/AdminDirectorRequests';
import axiosInstance from '../app/axiosInstance';

const AdminDirectorRequestsScreen = () => {
    const [directorRequests, setDirectorRequests] = useState([])
    const fetchDirectorRequests = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/getdirectorrequests',{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            setDirectorRequests(data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchDirectorRequests();
    }, [])

    return (
        <>
            <AdminHeader />
            <div className='flex flex-row'>
                <AdminSidebar />
                <AdminDirectorRequests directors={directorRequests} fetchDirectorRequests={fetchDirectorRequests} />
            </div>
        </>
    )
}

export default AdminDirectorRequestsScreen
