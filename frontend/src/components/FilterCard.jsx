import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: "Location",
    array: ["DelhiNCr", "Bangalore", "Hyderabad", "Pune", "Mumbai","Odisha"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer","Data Science"]
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
];

const FilterCard = () => {
  const [filters, setFiltersState] = useState({
    Location: "",
    Industry: "",
    Salary: ""
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFiltersState(updatedFilters);
    dispatch(setFilters(updatedFilters)); // dispatch immediately when filter is changed
  };

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />
      {
        filterData.map((data, index) => (
          <div key={index} className="mb-6">
            <h2 className="font-bold text-lg ">{data.filterType}</h2>
            <div className="flex flex-col gap-1">
              {data.array.map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={data.filterType}
                    value={item}
                    checked={filters[data.filterType] === item}
                    onChange={handleChange}
                    className="cursor-pointer"
                  />
                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default FilterCard;
