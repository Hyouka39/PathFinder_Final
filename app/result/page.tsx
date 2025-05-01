'use client';
import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import courseDetails from '../course-details/courseDetails'; // Import course details

const Result = () => {
  const [showResult, setShowResult] = useState(false);
  const [showNotification, setShowNotification] = useState(true); // Step notification state
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // Selected course state

  const recommendations = Object.keys(courseDetails); // Use keys from courseDetails

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-8">
      {showNotification ? (
        <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
          <div className="bg-white pt-20 pb-16 pl-16 pr-16 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-10 text-center">Steps to Complete</h2>
            <ul className="list-decimal pl-8 mb-10 text-xl md:text-2xl lg:text-2xl">
              <li className="mb-4 flex items-center gap-4">
                <FaCheckCircle className="text-brown-6" size={26} />
                Step 1: Scholastic Record
              </li>
              <li className="mb-4 flex items-center gap-4">
                <FaCheckCircle className="text-brown-6" size={26} />
                Step 2: Personality Test
              </li>
              <li className="mb-4 flex items-center gap-4">
                <FaCheckCircle className="text-brown-6" size={26} />
                Step 3: Knowledge Test
              </li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNotification(false)}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded text-xl px-8 py-2 hover:bg-brown-700 hover:border-brown-700"
              >
                See result
              </button>
            </div>
          </div>
        </div>
      ) : selectedCourse ? (
        <div className="bg-brown-1 shadow-lg rounded-lg p-8 w-full max-w-2xl ">
          <h1 className="text-3xl font-bold mb-6 text-center capitalize text-black">
            {selectedCourse}
          </h1>
          <p className="text-lg text-center text-black">
            {courseDetails[selectedCourse]?.description || "Details not available."}
          </p>
          {courseDetails[selectedCourse]?.careers.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">Possible Career Paths:</h2>
              <ul className="list-disc list-inside text-black">
                {courseDetails[selectedCourse].careers.map((career, index) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center mt-8 ">
            <button
              onClick={() => setSelectedCourse(null)}
              className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded-lg text-xl px-8 py-2 hover:bg-brown-700 hover:border-brown-700"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <div id="recommendations" className="bg-brown-1 border-brown-6 shadow-lg rounded-lg p-8 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center text-black">
            PathFinder Recommended Programs
          </h1>
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-white">
            {recommendations.map((course, index) => (
              <div
                key={index}
                onClick={() => setSelectedCourse(course)}
                className="bg-brown-6 shadow-lg rounded-lg p-8 w-96 md:w-80 lg:w-96 flex flex-col justify-center items-center border-2 border-brown-6 hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-center mb-4">{course}</h2>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={() => alert('Generating detailed report...')} // Placeholder action
              className="btn btn-primary bg-brown-1 border-brown-6 text-black rounded-lg text-2xl px-8 py-3 h-20 hover:shadow-xl hover:bg-brown-6 hover:border-brown-6  hover:scale-105 transition-transform cursor-pointer hover:text-white "
            >
              Generate Detailed Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
