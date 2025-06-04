import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import {motion} from 'framer-motion';

//const jobsArray=[1,2,3,4,5,6,7,8];

const Jobs = () => {
  const {allJobs, searchedQuery}=useSelector(store=>store.job);
  const {filters} = useSelector(store => store.job);
  const [filterJobs,setFilterJobs]=useState(allJobs);

   useEffect(() => {
        let filteredJobs = allJobs;

        if (searchedQuery && typeof searchedQuery === 'string' && searchedQuery.trim() !== '') {
            filteredJobs = filteredJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            });
        }

        if (filters) {
            if (filters.Location && filters.Location !== "") {
                filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(filters.Location.toLowerCase()));
            }
            if (filters.Industry && filters.Industry !== "") {
                filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(filters.Industry.toLowerCase()));
            }
            if (filters.Salary && filters.Salary !== "") {
                // Implement basic range filtering for salary
                filteredJobs = filteredJobs.filter(job => {
                    const salaryVal = job.salary;
                    const salaryRange = filters.Salary;
                    if (typeof salaryVal === "string") {
                        if (salaryRange === "0-40k") {
                            return salaryVal.includes("0") || salaryVal.includes("40k");
                        } else if (salaryRange === "42-1lakh") {
                            return salaryVal.includes("42") || salaryVal.includes("1lakh");
                        } else if (salaryRange === "1lakh to 5lakh") {
                            return salaryVal.includes("1lakh") || salaryVal.includes("5lakh");
                        }
                    } else if (typeof salaryVal === "number") {
                        if (salaryRange === "0-40k") {
                            return salaryVal >= 0 && salaryVal <= 40000;
                        } else if (salaryRange === "42-1lakh") {
                            return salaryVal >= 42000 && salaryVal <= 100000;
                        } else if (salaryRange === "1lakh to 5lakh") {
                            return salaryVal >= 100000 && salaryVal <= 500000;
                        }
                    }
                    return false;
                });
            }
        }

        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, filters]);

  return (
    <div>
      <Navbar/>
      <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>
            <div className='w-20%'>
                <FilterCard/>
            </div>
            {
                filterJobs.length <= 0 ? <span>Job not found</span> :(
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                        <div className='grid grid-cols-3 gap-4'>
                           {
                              filterJobs.map((job)=>(
                               <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                             ))
                            }
                        </div>
                    </div>

                )
            }
        </div>
      </div>
    </div>
  )
}

export default Jobs