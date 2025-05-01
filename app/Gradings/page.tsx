'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {
  const [track, setTrack] = useState<string | null>(null); // Track selection state
  const [gradeLevel, setGradeLevel] = useState(11); // Grade level state
  const [semester, setSemester] = useState(1); // Semester state
  const [subjects, setSubjects] = useState<string[]>([]); // Subjects fetched from the database
  const [grades, setGrades] = useState<string[]>([]); // Initialize grades for each subject
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation popup state
  const [showStepsModal, setShowStepsModal] = useState(true); // Modal for steps
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!track) {
        console.warn('No track selected. Skipping fetch.');
        return;
      }

      try {
        console.log('Fetching subjects with parameters:', {
          strand: track,
          grade_level: gradeLevel,
          semester: semester,
        });

        const response = await axios.get('/api/scholastic-records', {
          params: {
            strand: track,
            grade_level: gradeLevel,
            semester: semester,
          },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
          console.log('Subjects fetched successfully:', response.data);
          setSubjects(response.data); // Update subjects with data from the database
          setGrades(Array(response.data.length).fill('')); // Reset grades for the fetched subjects
        } else {
          console.error('Unexpected API response:', response);
          setSubjects([]); // Set to an empty array if the response is invalid
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          alert('No subjects found for the selected parameters.');
        } else {
          console.error('Failed to fetch subjects:', error);
          alert('Failed to fetch subjects. Please try again later.');
        }
        setSubjects([]); // Set to an empty array if the API call fails
      }
    };

    fetchSubjects();
  }, [track, gradeLevel, semester]);

  const handleGradeChange = (index: number, value: string) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = value;
    setGrades(updatedGrades);
  };

  const handleNext = () => {
    if (semester === 1) {
      setSemester(2); // Move to the second semester
    } else if (gradeLevel === 11) {
      setGradeLevel(12); // Move to Grade 12
      setSemester(1); // Reset to the first semester
    } else {
      setShowConfirmation(true); // Show confirmation popup
    }
  };

  const handleBack = () => {
    if (semester === 2) {
      setSemester(1); // Move back to the first semester
    } else if (gradeLevel === 12) {
      setGradeLevel(11); // Move back to Grade 11
      setSemester(2); // Reset to the second semester
    } else {
      setTrack(null); // Go back to track selection
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Close confirmation popup
  };

  const handleConfirm = () => {
    console.log('Grades submitted:', grades);
    setShowConfirmation(false); // Close confirmation popup
    router.push('/PersonalityTest'); // Redirect to personality test
  };

  if (!track) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        {/* Steps Modal */}
        {showStepsModal && (
          <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
            <div className="bg-brown-1 pt-20 pb-16 pl-16 pr-16 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-10 text-center">Steps to Complete</h2>
              <ul className="list-decimal pl-8 mb-10 text-xl md:text-2xl lg:text-2xl">
                <li className="mb-4 flex items-center gap-4">
                  <span className="w-11 h-11 border-2 border-brown-6 rounded-full flex items-center justify-center text-brown-6">
                    1
                  </span>
                  Step 1: Scholastic Record
                </li>
                <li className="mb-4 flex items-center gap-4">
                  <span className="w-11 h-11 border-2 border-brown-6 rounded-full flex items-center justify-center text-brown-6">
                    2
                  </span>
                  Step 2: Personality Test
                </li>
                <li className="mb-4 flex items-center gap-4">
                  <span className="w-11 h-11 border-2 border-brown-6 rounded-full flex items-center justify-center text-brown-6">
                    3
                  </span>
                  Step 3: Knowledge Test
                </li>
              </ul>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowStepsModal(false)}
                  className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded text-xl px-8 py-2 hover:bg-brown-700 hover:border-brown-700"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Track Selection */}
        {!showStepsModal && (
          <div className="pt-10 md:pt-15 lg:pt-20 pb-8 md:12 lg:pb-16 lg:px-6 px-10 md:px-16 bg-brown-1 shadow-md rounded w-full max-w-md md:max-w-lg lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center text-black">Select Track</h1>
            <div className="flex flex-col items-center gap-4">
              <button
                className="btn text-white btn-primary text-lg md:text-xl lg:text-2xl h-[30px] md:h-[40px] lg:h-[50px] w-[200px] md:w-[250px] lg:w-[300px] bg-brown-6 border-brown-6 hover:bg-brown-6 hover:border-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu"
                onClick={() => setTrack('STEM')}
              >
                STEM
              </button>
              <button
                className="btn text-white btn-primary text-lg md:text-xl lg:text-2xl h-[30px] md:h-[40px] lg:h-[50px] w-[200px] md:w-[250px] lg:w-[300px] bg-brown-6 border-brown-6 hover:bg-brown-6 hover:border-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu"
                onClick={() => setTrack('ABM')}
              >
                ABM
              </button>
              <button
                className="btn text-white btn-primary text-lg md:text-xl lg:text-2xl h-[30px] md:h-[40px] lg:h-[50px] w-[200px] md:w-[250px] lg:w-[300px] bg-brown-6 border-brown-6 hover:bg-brown-6 hover:border-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu"
                onClick={() => setTrack('HUMSS')}
              >
                HUMSS
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="p-10 bg-brown-1 shadow-md rounded w-full max-w-screen-lg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center text-black">{track}</h1>
        <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4 text-left text-black">
          GRADE - {gradeLevel} {semester === 1 ? 'First' : 'Second'} Semester
        </h1>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-black px-6 py-3 text-left text-black md:pr-[500px] lg:pr-[800px]">Subject</th>
                <th className="border border-black px-6 py-3 text-left text-black">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="border border-black px-6 py-3 text-black text-xl md:text-2xl lg:text-3xl">{subject}</td>
                  <td className="border border-black px-6 py-3">
                    <input
                      type="text"
                      value={grades[index] || ''}
                      onChange={(e) => handleGradeChange(index, e.target.value)}
                      className="text-black text-xl input input-bordered border-black w-16 md:w-20lg:w-20 bg-transparent"
                      placeholder={``}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-5 mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="btn-sm btn-secondary text-black bg-transparent border border-brown-6 rounded-lg text-[10px] md:text-[15px] lg:text-[18px] w-[80px] md:w-[170px] lg:w-[200px] h-[28px] md:h-[40px] lg:h-[48px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn-sm btn-primary text-white bg-brown-6 rounded-lg border-brown-6 text-[10px] md:text-[15px] lg:text-[18px] w-[80px] md:w-[170px] lg:w-[200px] h-[28px] md:h-[40px] lg:h-[48px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu"
            >
              {semester === 2 && gradeLevel === 12 ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
          <div className="bg-brown-1 pt-16 pb-10 pl-12 pr-10 rounded-lg shadow-md w-full max-w-lg md:max-w-xl lg:max-w-xl">
            <h2 className="text-3xl font-bold mb-8 items-center pr-0">Are you sure you want to submit?</h2>
            <div className="flex justify-end gap-5">
              <button
                onClick={handleCancel}
                className="btn btn-secondary bg-transparent border border-brown-6 text-black text-lg md:text-xl lg:text-xl rounded px-8 py-2 w-28 hover:bg-brown-700 hover:text-white hover:border-brown-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded-lg text-lg md:text-xl lg:text-xl px-8 py-2 w-28 hover:bg-brown-700 hover:border-brown-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
