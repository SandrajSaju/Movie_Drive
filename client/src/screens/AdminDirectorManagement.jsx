import React,{useState,useEffect} from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import AdminListDirectors from '../components/AdminListDirectors';
import axiosInstance from '../app/axiosInstance';

const AdminDirectorManagement = () => {

    const [allDirectors, setAllDirectors] = useState([])
    const fetchDirectors = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/getalldirectors',{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            setAllDirectors(data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchDirectors();
    }, [])
    return (
        <>
            <AdminHeader />
            <div className='flex flex-row'>
                <AdminSidebar />
                <AdminListDirectors directors={allDirectors} fetchDirectors={fetchDirectors} />
            </div>
        </>
    )
}

export default AdminDirectorManagement
