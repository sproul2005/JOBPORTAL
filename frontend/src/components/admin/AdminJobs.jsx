import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchJobByText } from '@/redux/jobSlice'
import AdminJobTable from './AdminJobTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'

const AdminJobs= () => {
  useGetAllAdminJobs();
  const [input,setInput]=useState("");
  const navigate=useNavigate();
  const dispatch=useDispatch(); 

  useEffect(()=>{
    dispatch(setSearchJobByText(input));
  },[input]);


  return (
    <div>
       <Navbar/>
       <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
            <Input
              className="w-full max-w-[12rem]"
              placeholder="Filter by name, role"
              onChange={(e)=>setInput(e.target.value)}
              />
              <Button onClick={()=>navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobTable/>
       </div>
    </div>
  )
}

export default AdminJobs
