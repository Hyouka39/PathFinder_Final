'use client'
import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaComment, FaCog, FaChevronDown, FaChevronUp, FaUser, FaLaptopCode, FaBriefcase, FaCogs, FaDraftingCompass, FaStar, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import Logo from '@/public/PATHFINDER-logo-edited.png';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, BarElement, PointElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2'; // Import chart components
import LogoutConfirmationModal from '@/app/components/Logout'; // Import the logout confirmation modal

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, BarElement, PointElement);

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar initially closed
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isAddCollegeFormVisible, setIsAddCollegeFormVisible] = useState(false);
  const [isAddProgramFormVisible, setIsAddProgramFormVisible] = useState(false);
  const [newCollege, setNewCollege] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false); // Add state for logout modal

  const [knowledgeTestQuestions, setKnowledgeTestQuestions] = useState<{
    [category: string]: { id: number; text: string; options: string[]; correctAnswer: string }[];
  }>({});

  const [activeKnowledgeType, setActiveKnowledgeType] = useState<string | null>(null); // General or Specific
  const [activeKnowledgeCategory, setActiveKnowledgeCategory] = useState<string | null>(null);
  const [newKnowledgeQuestion, setNewKnowledgeQuestion] = useState<string>('');
  const [newKnowledgeOptions, setNewKnowledgeOptions] = useState<string[]>(['', '', '', '']);
  const [newKnowledgeCorrectAnswer, setNewKnowledgeCorrectAnswer] = useState<string>('');
  const [editingKnowledgeIndex, setEditingKnowledgeIndex] = useState<number | null>(null);
  const [editedKnowledgeQuestion, setEditedKnowledgeQuestion] = useState<string>('');
  const [editedKnowledgeOptions, setEditedKnowledgeOptions] = useState<string[]>(['', '', '', '']);
  const [editedKnowledgeCorrectAnswer, setEditedKnowledgeCorrectAnswer] = useState<string>('');

  const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState<string>('');
  const [selectedFeedback, setSelectedFeedback] = useState<{ username: string; rating: number; comment: string } | null>(null);

  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editedProgramDetails, setEditedProgramDetails] = useState<string>('');

  const pieData = {
    labels: ['STEM', 'ABM', 'HUMSS'], // Labels for the chart
    datasets: [
      {
        data: [40, 30, 30], // Example data
        backgroundColor: ['#6F4E37', '#A67B5B', '#E4C59E'], // STEM: Brown-700, ABM: Brown-6, HUMSS: Light Brown
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'left' as const, // Use 'as const' to fix TypeScript error
        labels: {
          usePointStyle: true, // Circular legend
          pointStyle: 'circle',
          boxWidth: 8, // Smaller circle size
          padding: 15, // Add spacing between legend items
          color: '#000', // Legend text color
        },
      },
    },
    maintainAspectRatio: false, // Allow resizing
  };

  const stackedLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Example months
    datasets: [
      {
        label: 'Finished Tests',
        data: [30, 80, 60, 90, 70],
        borderColor: '#6F4E37',
        backgroundColor: '#6F4E37',
      },
      {
        label: 'Unfinished Tests',
        data: [80, 40, 70, 70, 40],
        borderColor: '#A67B5B',
        backgroundColor: '#A67B5B',
      },
    ],
  };

  const stackedLineOptions = {
    plugins: {
      legend: {
        position: 'top' as const, // Use 'as const' to fix TypeScript error
        labels: {
          usePointStyle: true, // Use circular markers for legend
          pointStyle: 'circle',
          boxWidth: 8, // Smaller circle size
          padding: 15, // Add spacing between legend items
          color: '#000', // Legend text color
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Example months
    datasets: [
      {
        label: 'Total Users',
        data: [100, 140, 150, 130, 180],
        borderColor: '#6F4E37',
        backgroundColor: '#6F4E37',
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['1','2','3','4','5'],
    datasets: [
      {
        label: 'Feedback',
        data: [10, 25,70,50,80], // Example data
        backgroundColor: ['#A67B5B', '#E4C59E'],
      },
    ],
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        if (response.status === 200 && Array.isArray(response.data)) {
          setQuestions(response.data); // Ensure the response contains an array of questions
        } else {
          console.error('Unexpected API response:', response);
          setQuestions([]); // Set to an empty array if the response is invalid
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setQuestions([]); // Set to an empty array if the API call fails
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchKnowledgeQuestions = async () => {
      try {
        const response = await axios.get('/api/knowledge-questions');
        if (response.status === 200) {
          const questions = response.data.reduce((acc: any, question: any) => {
            if (!acc[question.category]) acc[question.category] = [];
            acc[question.category].push({
              ...question,
              options: JSON.parse(question.options), // Parse options from JSON
            });
            return acc;
          }, {});
          setKnowledgeTestQuestions(questions);
        }
      } catch (error) {
        console.error('Failed to fetch knowledge test questions:', error);
      }
    };

    fetchKnowledgeQuestions();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedStrand || !selectedSemester) {
        console.warn('No strand or semester selected. Skipping fetch.');
        return;
      }

      try {
        const [grade, sem] = selectedSemester.split(' - ');
        const gradeLevel = grade.includes('11') ? 11 : 12;
        const semester = sem.includes('First') ? 1 : 2;

        console.log('Fetching subjects with:', { strand: selectedStrand, grade_level: gradeLevel, semester });

        const response = await axios.get('/api/scholastic-records', {
          params: {
            strand: selectedStrand,
            grade_level: gradeLevel,
            semester: semester,
          },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
          console.log('Subjects Fetched:', response.data);
          setSubjects(response.data); // Update subjects with data from the database
        } else {
          console.error('Unexpected API response:', response);
          setSubjects([]); // Set to an empty array if the response is invalid
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.error('API returned 404: Resource not found. Check backend route or database.');
          alert('No subjects found for the selected parameters. Please verify your selection.');
        } else {
          console.error('Failed to fetch subjects:', error);
          alert('Failed to fetch subjects. Please try again later.');
        }
        setSubjects([]); // Reset subjects to an empty array on error
      }
    };

    fetchSubjects();
  }, [selectedStrand, selectedSemester]);

  useEffect(() => {
    // Reset edit state when switching programs
    setIsEditingProgram(false);
    setEditedProgramDetails('');
  }, [activePage]);

  const resetState = () => {
    setEditingIndex(null);
    setEditedQuestion('');
    setNewQuestion('');
    setIsAddFormVisible(false);
    setEditingKnowledgeIndex(null);
    setEditedKnowledgeQuestion('');
    setEditedKnowledgeOptions(['', '', '', '']);
    setEditedKnowledgeCorrectAnswer('');
    setActiveKnowledgeType(null);
    setActiveKnowledgeCategory(null);
    setSelectedStrand(null);
    setSelectedSemester(null);
    setSubjects([]);
    setNewSubject('');
  };

  const handleSidebarClick = (page: string) => {
    resetState();
    setActivePage(page);
    if (page === 'Feedback') {
      setSelectedFeedback(null); // Reset feedback form to show buttons
    }
  };

  const toggleSidebar = () => {
    if (!isSidebarOpen) {
      setIsSettingsOpen(false);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (id: number) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setEditingIndex(id);
      setEditedQuestion(questionToEdit.text);
    }
  };

  const openConfirmModal = (action: () => void) => {
    setConfirmAction(() => action);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(() => () => {});
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingIndex ? { ...q, text: editedQuestion } : q
      );

      try {
        await axios.put(`/api/questions/${editingIndex}`, { text: editedQuestion });
        setQuestions(updatedQuestions);
        handleCancelEdit(); // Close edit modal
        closeConfirmModal(); // Close confirmation modal
      } catch (error) {
        console.error('Failed to update question:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedQuestion('');
  };

  const handleAddQuestion = async () => {
    if (questions.length >= 48) {
      alert('You cannot add more than 48 questions.');
      return;
    }
    if (!newQuestion.trim()) {
      alert('Question cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/questions', { text: newQuestion.trim() });
      setQuestions([...questions, response.data]); // Add the new question with id and text
      setNewQuestion('');
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleConfirmAddQuestion = async () => {
    if (questions.length >= 48) {
      alert('You cannot add more than 48 questions.');
      return;
    }
    if (!newQuestion.trim()) {
      alert('Question cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/questions', { text: newQuestion.trim() });
      setQuestions([...questions, response.data]); // Add the new question with id and text
      setNewQuestion('');
      setIsAddFormVisible(false); // Close add form
      closeConfirmModal(); // Close confirmation modal
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      const response = await axios.delete(`/api/questions/${id}`);
      if (response.status === 204) {
        const updatedQuestions = questions.filter((question) => question.id !== id);
        setQuestions(updatedQuestions); // Update state after successful deletion
        handleCancelEdit(); // Close the edit modal after deletion
        closeConfirmModal(); // Close confirmation modal
      } else {
        console.error('Unexpected response from delete API:', response);
      }
    } catch (error: any) {
      if (error.response?.status === 503) {
        alert('The database is busy. Please try again later.');
      } else {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const handleAddKnowledgeQuestion = async () => {
    if (!activeKnowledgeCategory) return;
    if (
      !newKnowledgeQuestion.trim() ||
      newKnowledgeOptions.some((opt) => !opt.trim()) ||
      !newKnowledgeCorrectAnswer.trim()
    ) {
      alert('Question, all options, and the correct answer must be filled.');
      return;
    }

    if (!newKnowledgeOptions.includes(newKnowledgeCorrectAnswer)) {
      alert('The correct answer must match one of the options.');
      return;
    }

    const requestData = {
      category: activeKnowledgeCategory,
      text: newKnowledgeQuestion.trim(),
      options: newKnowledgeOptions,
      correctAnswer: newKnowledgeCorrectAnswer,
    };

    try {
      const response = await axios.post('/api/knowledge-questions', requestData);
      setKnowledgeTestQuestions((prev) => ({
        ...prev,
        [activeKnowledgeCategory]: [...(prev[activeKnowledgeCategory] || []), response.data],
      }));
      setNewKnowledgeQuestion('');
      setNewKnowledgeOptions(['', '', '', '']);
      setNewKnowledgeCorrectAnswer('');
      setIsAddFormVisible(false);
    } catch (error) {
      console.error('Failed to add question:', error);
      alert('Failed to add question. Please try again.');
    }
  };

  const handleConfirmAddKnowledgeQuestion = () => {
    handleAddKnowledgeQuestion();
    closeConfirmModal();
  };

  const handleEditKnowledgeQuestion = (index: number) => {
    if (!activeKnowledgeCategory) return;
    const questionToEdit = knowledgeTestQuestions[activeKnowledgeCategory][index];
    if (questionToEdit) {
      setEditingKnowledgeIndex(index);
      setEditedKnowledgeQuestion(questionToEdit.text);
      setEditedKnowledgeOptions(questionToEdit.options);
      setEditedKnowledgeCorrectAnswer(questionToEdit.correctAnswer);
    }
  };

  const handleSaveKnowledgeEdit = async () => {
    if (!activeKnowledgeCategory || editingKnowledgeIndex === null) return;

    const questionToEdit = knowledgeTestQuestions[activeKnowledgeCategory][editingKnowledgeIndex];
    const updatedQuestion = {
      ...questionToEdit,
      text: editedKnowledgeQuestion,
      options: editedKnowledgeOptions,
      correctAnswer: editedKnowledgeCorrectAnswer,
    };

    try {
      await axios.put(`/api/knowledge-questions?id=${questionToEdit.id}`, {
        category: activeKnowledgeCategory,
        text: editedKnowledgeQuestion,
        options: editedKnowledgeOptions,
        correctAnswer: editedKnowledgeCorrectAnswer,
      });

      setKnowledgeTestQuestions((prev) => ({
        ...prev,
        [activeKnowledgeCategory]: prev[activeKnowledgeCategory].map((q, index) =>
          index === editingKnowledgeIndex ? updatedQuestion : q
        ),
      }));

      setEditingKnowledgeIndex(null);
      setEditedKnowledgeQuestion('');
      setEditedKnowledgeOptions(['', '', '', '']);
      setEditedKnowledgeCorrectAnswer('');
    } catch (error) {
      console.error('Failed to update question:', error);
      alert('Failed to update question. Please try again.');
    }
  };

  const handleConfirmSaveKnowledgeEdit = () => {
    handleSaveKnowledgeEdit();
    closeConfirmModal();
  };

  const handleDeleteKnowledgeQuestion = async (index: number) => {
    if (!activeKnowledgeCategory) return;
    const questionToDelete = knowledgeTestQuestions[activeKnowledgeCategory][index];
    try {
      await axios.delete(`/api/knowledge-questions?id=${questionToDelete.id}`);
      setKnowledgeTestQuestions((prev) => ({
        ...prev,
        [activeKnowledgeCategory]: prev[activeKnowledgeCategory].filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleConfirmDeleteKnowledgeQuestion = (index: number) => {
    handleDeleteKnowledgeQuestion(index);
    setEditingKnowledgeIndex(null); // Close the edit form
    closeConfirmModal(); // Close the confirmation modal
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (!newSubject.trim()) {
      alert('Subject cannot be empty.');
      return;
    }
  
    openConfirmModal(async () => {
      try {
        if (!selectedStrand || !selectedSemester) {
          throw new Error('Strand or semester is not selected.');
        }
  
        const gradeLevel = selectedSemester.includes('11') ? 11 : 12;
        const semester = selectedSemester.includes('First') ? 1 : 2;
  
        const response = await axios.post('/api/scholastic-records', {
          strand: selectedStrand,
          grade_level: gradeLevel,
          semester: semester,
          subject: newSubject.trim(),
        });
  
        if (response.status === 201) {
          setSubjects([...subjects, newSubject.trim()]);
        }
      } catch (error) {
        console.error('Failed to add subject:', error);
        alert('Failed to add subject. Please try again.');
      }
      closeConfirmModal();
      setNewSubject(''); // Clear the input field after confirmation
    });
  };
  
  const handleDeleteSubject = (index: number) => {
    openConfirmModal(async () => {
      try {
        if (!selectedStrand || !selectedSemester) {
          throw new Error('Strand or semester is not selected.');
        }
  
        const gradeLevel = selectedSemester.includes('11') ? 11 : 12;
        const semester = selectedSemester.includes('First') ? 1 : 2;
  
        const response = await axios.delete('/api/scholastic-records', {
          data: {
            strand: selectedStrand,
            grade_level: gradeLevel,
            semester: semester,
            subject: subjects[index],
          },
        });
  
        if (response.status === 204) {
          setSubjects(subjects.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error('Failed to delete subject:', error);
        alert('Failed to delete subject. Please try again.');
      }
      closeConfirmModal();
      setEditingIndex(null); // Close the edit form
      setNewSubject(''); // Clear the input field after deletion
    });
  };
  
  const handleEditSubject = (index: number) => {
    const subjectToEdit = subjects[index];
    setEditingIndex(index);
    setNewSubject(subjectToEdit); // Temporarily store the subject being edited
  };

  const closeEditSubjectForm = () => {
    setEditingIndex(null); // Close the edit form
    setNewSubject(''); // Clear the input field
  };
  
  const handleSaveEditedSubject = () => {
    if (!newSubject.trim()) {
      alert('Subject cannot be empty.');
      return;
    }
  
    openConfirmModal(async () => {
      try {
        if (!selectedStrand || !selectedSemester) {
          throw new Error('Strand or semester is not selected.');
        }
  
        const gradeLevel = selectedSemester.includes('11') ? 11 : 12;
        const semester = selectedSemester.includes('First') ? 1 : 2;
  
        const response = await axios.put('/api/scholastic-records', {
          strand: selectedStrand,
          grade_level: gradeLevel,
          semester: semester,
          oldSubject: subjects[editingIndex!],
          newSubject: newSubject.trim(),
        });
  
        if (response.status === 200) {
          const updatedSubjects = [...subjects];
          updatedSubjects[editingIndex!] = newSubject.trim();
          setSubjects(updatedSubjects);
        }
      } catch (error) {
        console.error('Failed to edit subject:', error);
        alert('Failed to edit subject. Please try again.');
      }
      closeConfirmModal();
      setEditingIndex(null); // Close the edit form
      setNewSubject(''); // Clear the input field
    });
  };

  const handleAddCollege = () => {
    if (!newCollege.trim()) {
      alert('College name cannot be empty.');
      return;
    }
    // Logic to add the new college (e.g., API call or state update)
    setNewCollege('');
    setIsAddCollegeFormVisible(false);
  };

  const handleAddProgram = () => {
    if (!newProgram.trim()) {
      alert('Program name cannot be empty.');
      return;
    }
    // Logic to add the new program (e.g., API call or state update)
    setNewProgram('');
    setIsAddProgramFormVisible(false);
  };

  const programDetails: Record<string, string> = {
    'Bachelor of Arts in Communication': 'This program focuses on developing communication skills in various media platforms.',
    'Bachelor of Arts in Political Science': 'This program provides an understanding of political systems and governance.',
    'Bachelor of Arts in Philippine Studies': 'This program explores Philippine culture, history, and society.',
    'Bachelor of Science in Social Work': 'This program prepares students for careers in social services and community development.',
    'Bachelor of Science in Psychology': 'This program studies human behavior and mental processes.',
    'Bachelor of Science in Accountancy': 'This program trains students in financial accounting and auditing.',
    'Bachelor of Science in Management Accounting': 'This program focuses on managerial accounting and decision-making.',
    // ...add details for other programs...
  };

  const renderProgramDetails = (program: string) => (
    <div className="flex flex-col items-center min-h-screen px-8">
      <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">{program}</h1>
      <form className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <textarea
          value={isEditingProgram ? editedProgramDetails : programDetails[program]}
          onChange={(e) => setEditedProgramDetails(e.target.value)}
          readOnly={!isEditingProgram}
          className="w-full p-4 border rounded-lg bg-gray-200 text-black"
          rows={6}
        />
      </form>
      {isEditingProgram ? (
        <div className="flex gap-4 mt-4 justify-end w-full max-w-4xl">
          <button
            onClick={() => {
              setEditedProgramDetails(programDetails[program]); // Discard changes
              setIsEditingProgram(false);
            }}
            className="bg-brown-1 border border-brown-6 w-20 btn-md text-xs text-black rounded-lg shadow-lg hover:bg-brown-6 hover:text-white hover:scale-95 transition-transform duration-300 transform-gpu"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              programDetails[program] = editedProgramDetails; // Save changes
              setIsEditingProgram(false);
            }}
            className="bg-brown-6 text-white rounded-lg w-20 btn-md shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setEditedProgramDetails(programDetails[program]); // Initialize edit state
            setIsEditingProgram(true);
          }}
          className="fixed bottom-8 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
        >
          Edit
        </button>
      )}
      <button
        onClick={() => setActivePage('Arts and Humanities Programs')} // Navigate back to specific program list
        className="fixed bottom-8 right-8 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
      >
        Back
      </button>
    </div>
  );

  const renderKnowledgeTestContent = () => {
    if (!activeKnowledgeType) {
      // Step 1: Show General and Specific Knowledge buttons
      return (
        <div className="flex flex-col items-center min-h-screen px-8">
          <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Select Knowledge Type</h1>
          <form className="bg-brown-1 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setActiveKnowledgeType('General Knowledge')}
                className="bg-brown-6 text-white rounded-lg w-40 h-40 shadow-lg hover:bg-brown-700 flex items-center justify-center text-lg font-bold hover:scale-95 transition-transform duration-300 transform-gpu"
              >
                General Knowledge
              </button>
              <button
                onClick={() => setActiveKnowledgeType('Specific Knowledge')}
                className="bg-brown-6 text-white rounded-lg w-40 h-40 shadow-lg hover:bg-brown-700 flex items-center justify-center text-lg font-bold hover:scale-95 transition-transform duration-300 transform-gpu"
              >
                Specific Knowledge
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (!activeKnowledgeCategory) {
      // Step 2: Show subcategories based on selected type
      const subcategories =
        activeKnowledgeType === 'General Knowledge'
          ? [
              'Mathematics',
              'Science',
              'English',
              'Filipino',
              'Reading Comprehension',
              'Logical Reasoning',
            ]
          : [
              'Technology',
              'Engineering',
              'Accountancy',
              'Business',
              'Management',
              'Humanities',
              'Social Sciences',
            ];

      return (
        <div className="flex flex-col items-center min-h-screen px-8 relative">
          <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
            {activeKnowledgeType}
          </h1>
          <form className="bg-brown-1 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => setActiveKnowledgeCategory(`${activeKnowledgeType} - ${subcategory}`)}
                  className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </form>
          <button
            onClick={() => setActiveKnowledgeType(null)}
            className="absolute bottom-36 right-1 w-36 bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
          >
            Back
          </button>
        </div>
      );
    }

    if (activeKnowledgeCategory) {
      // Step 3: Show questions for the selected category
      return (
        <div className="flex flex-col items-center min-h-screen px-8 relative">
          <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
            {activeKnowledgeCategory}
          </h1>
          <form className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="grid grid-cols-10 gap-4 mb-1">
              {knowledgeTestQuestions[activeKnowledgeCategory]?.map((question, index) => (
                <button
                  key={question.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setEditingKnowledgeIndex(index);
                    setEditedKnowledgeQuestion(question.text);
                    setEditedKnowledgeOptions(question.options);
                    setEditedKnowledgeCorrectAnswer(question.correctAnswer);
                  }}
                  className="w-11 h-11 bg-white border-2 text-black rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 transform-gpu hover:scale-95 text-sm flex items-center justify-center"
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </form>
          <div className="fixed bottom-8 right-8 flex gap-5">
            <button
              onClick={(event) => {
                event.preventDefault();
                setIsAddFormVisible(true);
              }}
              className="bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add Question
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                setActiveKnowledgeCategory(null);
              }}
              className="bg-transparent border-brown-6 border text-black rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:text-white hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>
          </div>
          {isAddFormVisible && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-black">Add New Question</h2>
                <textarea
                  value={newKnowledgeQuestion}
                  onChange={(e) => setNewKnowledgeQuestion(e.target.value)}
                  placeholder="Enter a new question..."
                  className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                  rows={3}
                />
                <div className="mb-4">
                  {newKnowledgeOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...newKnowledgeOptions];
                          updatedOptions[index] = e.target.value;
                          setNewKnowledgeOptions(updatedOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-black font-bold mb-2">Correct Answer:</label>
                  <select
                    value={newKnowledgeCorrectAnswer}
                    onChange={(e) => setNewKnowledgeCorrectAnswer(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                  >
                    <option value="" disabled>
                    </option>
                    {newKnowledgeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsAddFormVisible(false)}
                    className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    style={{
                      height: '35px',
                      width: '80px',
                      minHeight: '10px',
                      maxHeight: '50px',
                      padding: '0 10px',
                      lineHeight: '25px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => openConfirmModal(handleConfirmAddKnowledgeQuestion)}
                    className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-7 py-2 hover:bg-brown-700 hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    style={{
                      height: '35px',
                      width: '80px',
                      minHeight: '10px',
                      maxHeight: '50px',
                      padding: '0 10px',
                      lineHeight: '25px',
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          {editingKnowledgeIndex !== null && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-brown-1 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                  onClick={() => setEditingKnowledgeIndex(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-black">Edit Question</h2>
                <textarea
                  value={editedKnowledgeQuestion}
                  onChange={(e) => setEditedKnowledgeQuestion(e.target.value)}
                  className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                  rows={4}
                />
                <div className="mb-4">
                  {editedKnowledgeOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...editedKnowledgeOptions];
                          updatedOptions[index] = e.target.value;
                          setEditedKnowledgeOptions(updatedOptions);
                        }}
                        className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-black font-bold mb-2">Correct Answer:</label>
                  <select
                    value={editedKnowledgeCorrectAnswer}
                    onChange={(e) => setEditedKnowledgeCorrectAnswer(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                  >
                    {editedKnowledgeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                <button
                    onClick={() => openConfirmModal(() => handleConfirmDeleteKnowledgeQuestion(editingKnowledgeIndex))}
                    className="btn btn-danger border-brown-6 bg-transparent text-black rounded px-5 py-2 hover:bg-brown-700 hover:text-white hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    style={{
                      height: '35px',
                      width: '80px',
                      minHeight: '10px',
                      maxHeight: '50px',
                      padding: '0 10px',
                      lineHeight: '25px',
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openConfirmModal(handleConfirmSaveKnowledgeEdit)}
                    className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-7 py-2 hover:bg-brown-700 hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    style={{
                      height: '35px',
                      width: '80px',
                      minHeight: '10px',
                      maxHeight: '50px',
                      padding: '0 10px',
                      lineHeight: '25px',
                    }}
                  >
                    Save
                  </button>
                 
                </div>
              </div>
            </div>
          )}
          {isConfirmModalOpen && (
           <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
           <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-sm">
             <h2 className="text-[19px] font-bold mb-8 items-center pr-0 text-black text-center pt-3">
               Are you sure you want to submit?
             </h2>
             <div className="flex justify-end gap-2">
               <button
                 onClick={closeConfirmModal}
                 className="bg-transparent border border-brown-6 text-black font-bold text-lg md:text-xl lg:text-xs rounded hover:bg-brown-700 hover:text-white hover:border-brown-700"
                 style={{
                   height: '30px',
                   width: '70px',
                   minHeight: '10px',
                   maxHeight: '50px',
                   padding: '0 10px',
                   lineHeight: '25px',
                 }}
               >
                 Cancel
               </button>
               <button
                 onClick={() => {
                   confirmAction();
                 }}
                 className="btn bg-brown-6 border-brown-6 text-white rounded text-sm md:text-xl lg:text-xs hover:bg-brown-700 hover:border-brown-700"
                 style={{
                   height: '30px',
                   width: '72px',
                   minHeight: '10px',
                   maxHeight: '50px',
                   padding: '0 10px',
                   lineHeight: '25px',
                 }}
               >
                 Confirm
               </button>
             </div>
           </div>
         </div>
          )}
        </div>
      );
    }
  };

  const renderScholasticRecordContent = () => {
    if (!selectedStrand) {
      return (
        <div className="flex flex-col items-center min-h-screen px-8">
          <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Select Strand</h1>
          <form className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex flex-col gap-4">
              {['STEM', 'ABM', 'HUMSS'].map((strand) => (
                <button
                  key={strand}
                  onClick={() => setSelectedStrand(strand)}
                  className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                >
                  {strand}
                </button>
              ))}
            </div>
          </form>
        </div>
      );
    }

    if (!selectedSemester) {
      return (
        <div className="flex flex-col items-center min-h-screen px-8">
          <h1 className="text-3xl font-bold mt-2 mb-4 text-center text-black">{selectedStrand}</h1>
          <form className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-xl">
            <div className="grid grid-cols-2 gap-6">
              {['Grade 11 - First Semester', 'Grade 11 - Second Semester', 'Grade 12 - First Semester', 'Grade 12 - Second Semester'].map((semester) => (
                <button
                  key={semester}
                  onClick={() => setSelectedSemester(semester)}
                  className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                >
                  {semester}
                </button>
              ))}
            </div>
          </form>
          <button
            onClick={() => setSelectedStrand(null)}
            className="fixed bottom-8 right-8 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
          >
            Back
          </button>
        </div>
      );
    }
    // Add a back button when a semester is selected
    return (
      <div className="flex flex-col items-center min-h-screen px-8">
        <h1 className="text-3xl font-bold text-center text-black">
          {selectedStrand} - {selectedSemester}
        </h1>
        <form onSubmit={handleAddSubject} className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-xl mt-4 mb-1">
          <ul className="mb-2">
            {subjects.map((subject, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditSubject(index); // Set the index of the subject being edited
                  }}
                  className="w-full text-left bg-gray-200 text-black p-2 rounded-lg hover:bg-gray-300 transition-transform duration-300 transform-gpu"
                >
                  {subject}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add a new subject..."
              className="w-full p-2 border rounded-lg bg-gray-200 text-black"
            />
            <button
              type="submit"
              className="bg-brown-6 text-white rounded-lg px-4 py-2 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
          </div>
        </form>
        <button
          onClick={() => setSelectedSemester(null)}
          className="fixed bottom-8 right-8 bg-brown-6 w-36 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
        >
          Back
        </button>

        {editingIndex !== null && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={closeEditSubjectForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4 text-black">Edit Subject</h2>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-200 text-black mb-4"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => handleDeleteSubject(editingIndex)}
                  className="btn btn-danger border-brown-6 bg-transparent text-black rounded px-5 py-2 hover:bg-brown-700 hover:text-white hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    style={{
                      height: '35px',
                      width: '80px',
                      minHeight: '10px',
                      maxHeight: '50px',
                      padding: '0 10px',
                      lineHeight: '25px',
                    }}
                >
                  Delete
                </button>
                <button
                  onClick={handleSaveEditedSubject}
                  className="btn bg-brown-6 border-brown-6 text-white rounded text-sm md:text-xl lg:text-sm hover:bg-brown-700 hover:border-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                 style={{
                   height: '35px',
                   width: '80px',
                   minHeight: '10px',
                   maxHeight: '50px',
                   padding: '0 10px',
                   lineHeight: '25px',
                 }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-[19px] font-bold mb-8 items-center pr-0 text-black text-center pt-3">
                Are you sure you want to proceed?
              </h2>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeConfirmModal}
                  className="bg-transparent border border-brown-6 text-black font-bold text-lg md:text-xl lg:text-xs rounded hover:bg-brown-700 hover:text-white hover:border-brown-700"
                  style={{
                    height: '30px',
                    width: '70px',
                    minHeight: '10px',
                    maxHeight: '50px',
                    padding: '0 10px',
                    lineHeight: '25px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmAction();
                  }}
                  className="btn bg-brown-6 border-brown-6 text-white rounded text-sm md:text-xl lg:text-xs hover:bg-brown-700 hover:border-brown-700"
                  style={{
                    height: '30px',
                    width: '72px',
                    minHeight: '10px',
                    maxHeight: '50px',
                    padding: '0 10px',
                    lineHeight: '25px',
                  }}
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

  const renderDashboardContent = () => (
    <div className="grid grid-cols-10 gap-4 p-4">
      {/* Pie Chart */}
      <div className="bg-brown-1 p-3 rounded-lg shadow-lg col-span-3">
        <h2 className="text-base font-bold mb-3 text-black">Top Strand Users</h2>
        <div className="h-48">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      {/* Stacked Line Graph */}
      <div className="bg-brown-1 p-3 rounded-lg shadow-lg col-span-7">
        <h2 className="text-base font-bold mb-3 text-black">Test Completion</h2>
        <div className="h-52">
          <Line data={stackedLineData} options={stackedLineOptions} />
        </div>
      </div>
      {/* Total Users */}
      <div className="bg-brown-1 p-4 rounded-lg shadow-lg col-span-5">
        <h2 className="text-base font-bold mb-3 text-black">Total Users</h2>
        <div className="h-56"> {/* Occupy full height */}
          <Line
            data={lineData}
            options={{
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    usePointStyle: true, // Circular markers for legend
                    pointStyle: 'circle',
                    boxWidth: 8,
                    padding: 15,
                    color: '#000',
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
      {/* Feedback */}
      <div className="bg-brown-1 p-4 rounded-lg shadow-lg col-span-3">
        <h2 className="text-base font-bold mb-3 text-black">Feedback</h2>
        <div className="h-56 w-full"> {/* Ensure full height and width */}
          <Bar
            data={barData}
            options={{
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    usePointStyle: true, // Circular markers for legend
                    pointStyle: 'circle',
                    boxWidth: 8,
                    padding: 15,
                    color: '#000',
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
      {/* Recommended Top Programs */}
      <div className="col-span-2 flex flex-col gap-4">
        <button className="bg-brown-1 p-4 rounded-lg shadow-lg h-[86px] text-black font-bold hover:brown-1 flex items-center gap-3 hover:scale-95 transition-transform duration-300 transform-gpu">
          <FaLaptopCode size={30} className="text-brown-6" />
          Computer Science
        </button>
        <button className="bg-brown-1 p-4 rounded-lg shadow-lg h-[86px] text-black font-bold hover:bg-brown-1 flex items-center gap-3 hover:scale-95 transition-transform duration-300 transform-gpu">
          <FaDraftingCompass size={30} className="text-brown-6" />
          Architecture
        </button>
        <button className="bg-brown-1 p-4 rounded-lg shadow-lg h-[86px] text-black font-bold hover:bg-brown-1 flex items-center gap-3 hover:scale-95 transition-transform duration-300 transform-gpu">
          <FaCogs size={30} className="text-brown-6" />
          Engineering
        </button>
      </div>
    </div>
  );

  const feedbacks = [
    { username: 'Andrew', rating: 5, comment: 'Great system! Very user-friendly.' },
    { username: 'Bryan', rating: 4, comment: 'Good experience, but could use some improvements.' },
    { username: 'Jerone', rating: 3, comment: 'Average. Needs more features.' },
    { username: 'Engilbert', rating: 2, comment: 'Not very intuitive. Needs better design.' },
    { username: 'Andrew', rating: 5, comment: 'Great system! Very user-friendly.' },
    { username: 'Bryan', rating: 4, comment: 'Good experience, but could use some improvements.' },
    { username: 'Jerone', rating: 3, comment: 'Average. Needs more features.' },
    { username: 'Engilbert', rating: 2, comment: 'Not very intuitive. Needs better design.' },
    { username: 'Andrew', rating: 5, comment: 'Great system! Very user-friendly.' },
    { username: 'Bryan', rating: 4, comment: 'Good experience, but could use some improvements.' },
    { username: 'Jerone', rating: 3, comment: 'Average. Needs more features.' },
    { username: 'Engilbert', rating: 2, comment: 'Not very intuitive. Needs better design.' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-9 h-9 ${
          index < rating ? 'text-brown-6' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderFeedbackContent = () => (
    <div className="flex flex-col items-center min-h-screen px-8">
      <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">User Feedback</h1>
      <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        {!selectedFeedback ? (
          <div className="space-y-4 max-h-96 overflow-y-auto"> {/* Add scrollable container */}
            {feedbacks.map((feedback, index) => (
              <button
                key={index}
                onClick={() => setSelectedFeedback(feedback)}
                className="w-full flex justify-between items-center border-2 border-brown-6 bg-brown-6 text-white p-4 rounded-lg hover:bg-brown-6 hover:scale-95 transition-transform duration-300 transform-gpu"
              >
                <span>{feedback.username}</span>
                <span className="flex items-center gap-1">
                  <FaStar className="w-7 h-7 text-brown-1" />
                  <span className="text-lg text-black">{feedback.rating}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <form className="space-y-4">
            <button
              onClick={() => setSelectedFeedback(null)}
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black text-center">{selectedFeedback.username}</h2>
            <div className="flex justify-center mb-4">
              <div className="flex gap-2">{renderStars(selectedFeedback.rating)}</div>
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Comment:</label>
              <textarea
                value={selectedFeedback.comment}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                rows={4}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return renderDashboardContent();
      case 'Feedback':
        return renderFeedbackContent();
      case 'Settings':
        return <div>Manage your Settings here.</div>;
      case 'Scholastic Record':
        return renderScholasticRecordContent();
      case 'Personality Test':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            {/* Adjusted margin to move closer to the PathFinder label */}
            <h1 className="text-3xl md:text-4xl lg:text-2xl font-bold mt-4 mb-4 text-center text-black">
              Edit Personality Test Questions
            </h1>
            {questions.length > 0 ? (
              <>
                {/* Reduced form size while keeping 8 buttons per row */}
                {/* Reduced form size while keeping 8 buttons per row */}
                <form className="bg-brown-1 border-2 border-brown-1 p-3 rounded-lg shadow-lg w-full max-w-md mb-4">
                  <div className="grid grid-cols-8 gap-3">
                    {questions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={(event) => {
                          event.preventDefault(); // Prevent form submission
                          handleEditClick(question.id);
                        }}
                        className="w-11 h-11 bg-white border-2 text-black rounded-lg shadow hover:bg-gray-200 text-sm flex items-center justify-center hover:scale-95 transition-transform duration-300 transform-gpu"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </form>
                {isAddFormVisible && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4 text-black">Add New Question</h2>
                      <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter a new question..."
                        className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                        rows={3}
                      />
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setIsAddFormVisible(false)}
                          className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                          style={{
                            height: '35px',
                            width: '80px',
                            minHeight: '10px',
                            maxHeight: '50px',
                            padding: '0 10px',
                            lineHeight: '25px',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => openConfirmModal(handleConfirmAddQuestion)}
                          className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                          style={{
                            height: '35px',
                            width: '80px',
                            minHeight: '10px',
                            maxHeight: '50px',
                            padding: '0 10px',
                            lineHeight: '25px',
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsAddFormVisible(true)}
                  className="fixed bottom-8 right-8 bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 transform hover:scale-95"
                >
                  Add Question
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500">Loading questions...</p>
            )}
            {editingIndex !== null && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    onClick={handleCancelEdit}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-black">Question</h2>
                  <textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openConfirmModal(() => handleDeleteQuestion(editingIndex))}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openConfirmModal(handleSaveEdit)}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isConfirmModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-sm">
                  <h2 className="text-[19px] font-bold mb-8 items-center pr-0 text-black text-center pt-3">
                    Are you sure you want to submit?
                  </h2>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeConfirmModal}
                      className="bg-transparent border border-brown-6 text-black font-bold text-lg md:text-xl lg:text-xs rounded hover:bg-brown-700 hover:text-white hover:border-brown-700"
                      style={{
                        height: '30px',
                        width: '70px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        confirmAction();
                      }}
                      className="btn bg-brown-6 border-brown-6 text-white rounded text-sm md:text-xl lg:text-xs hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '30px',
                        width: '72px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Knowledge Test':
        return renderKnowledgeTestContent();
      case 'Program Information':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Discipline group</h1>
            <form className="bg-brown-1 p-6 h-[400px] rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-4 gap-8">
                {[
                  'Business, Commerce, and Related Fields',
                  'Architecture and Town Planning',
                  'Education Science and Teacher Training',
                  'Engineering and Technology',
                  'Humanities',
                  'IT-Related Disciplines',
                  'Mass Communication and Documentation',
                  'Medical and Allied',
                  'Natural Science',
                  'Other Disciplines',
                  'Service Trades',
                  'Social and Behavioral Sciences',
                ].map((college) => (
                  <button
                    key={college}
                    onClick={() => {
                      if (college === 'Business, Commerce, and Related Fields') {
                        setActivePage('Business, Commerce, and Related Fields Programs');
                      } else if (college === 'Architecture and Town Planning') {
                        setActivePage('Architecture and Town Planning Programs');
                      } else if (college === 'Education Science and Teacher Training') {
                        setActivePage('Education Science and Teacher Training Programs');
                      } else if (college === 'Engineering and Technology') {
                        setActivePage('Engineering and Technology Programs');
                      } else if (college === 'Humanities') {
                        setActivePage('Humanities Programs');
                      } else if (college === 'IT-Related Disciplines') {
                        setActivePage('IT-Related Disciplines Programs');
                      } else if (college === 'Mass Communication and Documentation') {
                        setActivePage('Mass Communication and Documentation Programs');
                      } else if (college === 'Medical and Allied') {
                        setActivePage('Medical and Allied Programs');
                      }
                        else if (college === 'Natural Science') {
                        setActivePage('Natural Science Programs');
                      } else if (college === 'Other Disciplines') {
                        setActivePage('Other Disciplines Programs');
                      } else if (college === 'Service Trades') {
                        setActivePage('Service Trades Programs');
                      } else if (college === 'Social and Behavioral Sciences') {
                        setActivePage('Social and Behavioral Sciences Programs');
                      }
                    }}
                    className="bg-brown-6 text-white w-full h-24  rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {college}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddCollegeFormVisible(true)}
              className="fixed bottom-12 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => handleSidebarClick('Dashboard')}
              className="fixed bottom-12 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddCollegeFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Discipline</h2>
                  <textarea
                    value={newCollege}
                    onChange={(e) => setNewCollege(e.target.value)}
                    placeholder="Enter college name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddCollegeFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCollege}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Program Selection':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Programs</h1>
            <form className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {Object.keys(programDetails).map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-8 right-8 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>
          </div>
        );
      case 'Business, Commerce, and Related Fields Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Arts and Humanities Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Science in Accountancy',
                  'Bachelor of Science in Management Accounting',
                  'Bachelor of Science in Business Administration Major in Human Resource Management',
                  'Bachelor of Science in Business Administration Major in Business Economics',
                  'Bachelor of Science in Business Administration Major in Financial Management',
                  'Bachelor of Science in Business Administration Major in Marketing Management',
                  'Bachelor of Science in Entrepreneurship',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Architecture and Town Planning Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Business and Accountancy Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Science in Architecture',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Education Science and Teacher Training Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Criminal Justice Education Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {['Bachelor of Elementary Education',
                  'Bachelor of Secondary Education Major in English',
                  'Bachelor of Secondary Education Major in Filipino',
                  'Bachelor of Secondary Education Major in Mathematics',
                  'Bachelor of Secondary Education Major in Science',
                  'Bachelor of Secondary Education Major in Social Studies',
                  'Bachelor of Secondary Education Major in Values Education',
                  'Bachelor of Physical Education',].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Engineering and Technology Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Engineering Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Science in Civil Engineering',
                  'Bachelor of Science in Electrical Engineering',
                  'Bachelor of Science in Mechanical Engineering',
                  'Bachelor of Science in Petroleum Engineering',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Humanities Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Hospitality Management and Tourism Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Arts in Communication',
                  'Bachelor of Arts in Political Science',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'IT-Related Disciplines Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Sciences Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Science in Computer Science',
                  'Bachelor of Science in Information Technology',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Mass Communication and Documentation Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Nursing and Health Sciences Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Arts in Communication',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Medical and Allied Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Teacher Education Programs
            </h1>
            <form className="bg-brown-1 h-96 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {[
                  'Bachelor of Science in Nursing',
                  'Bachelor of Science in Midwifery',
                  'Bachelor of Science in Biology Major in Medical Biology',
                  'Bachelor of Science in Biology Major in Preparatory Medicine',
                ].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Natural Science Programs':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
              College of Architecture and Design Programs
            </h1>
            <form className="bg-brown-1 p-6 h-96 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-6">
                {['Bachelor of Science in Environmental Science',
                  'Bachelor of Science in Marine Biology',
                  'Bachelor of Science in Biology Major in Medical Biology',
                  'Bachelor of Science in Biology Major in Preparatory Medicine',].map((program) => (
                  <button
                    key={program}
                    onClick={() => setActivePage(program)}
                    className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    {program}
                  </button>
                ))}
              </div>
            </form>
            <button
              onClick={() => setIsAddProgramFormVisible(true)}
              className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Add
            </button>
            <button
              onClick={() => setActivePage('Program Information')}
              className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
            >
              Back
            </button>

            {isAddProgramFormVisible && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                  <textarea
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Enter program name..."
                    className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsAddProgramFormVisible(false)}
                      className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProgram}
                      className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                      style={{
                        height: '35px',
                        width: '80px',
                        minHeight: '10px',
                        maxHeight: '50px',
                        padding: '0 10px',
                        lineHeight: '25px',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        );
        case 'Other Disciplines Programs':
          return (
            <div className="flex flex-col items-center min-h-screen px-8">
              <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
                College of Architecture and Design Programs
              </h1>
              <form className="bg-brown-1 p-6 h-96 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="grid grid-cols-3 gap-6">
                  {['Bachelor of Science in Public Administration',
                    'Bachelor of Science in Criminology',
                    ].map((program) => (
                    <button
                      key={program}
                      onClick={() => setActivePage(program)}
                      className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                    >
                      {program}
                    </button>
                  ))}
                </div>
              </form>
              <button
                onClick={() => setIsAddProgramFormVisible(true)}
                className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
              >
                Add
              </button>
              <button
                onClick={() => setActivePage('Program Information')}
                className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
              >
                Back
              </button>
  
              {isAddProgramFormVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                    <textarea
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      placeholder="Enter program name..."
                      className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                      rows={3}
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setIsAddProgramFormVisible(false)}
                        className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                        style={{
                          height: '35px',
                          width: '80px',
                          minHeight: '10px',
                          maxHeight: '50px',
                          padding: '0 10px',
                          lineHeight: '25px',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddProgram}
                        className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                        style={{
                          height: '35px',
                          width: '80px',
                          minHeight: '10px',
                          maxHeight: '50px',
                          padding: '0 10px',
                          lineHeight: '25px',
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          );
          case 'Service Trades Programs':
            return (
              <div className="flex flex-col items-center min-h-screen px-8">
                <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
                  College of Architecture and Design Programs
                </h1>
                <form className="bg-brown-1 p-6 h-96 rounded-lg shadow-lg w-full max-w-4xl">
                  <div className="grid grid-cols-3 gap-6">
                    {['Bachelor of Science in Hospitality Management',
                      'Bachelor of Science in Tourism Management',

                      ].map((program) => (
                      <button
                        key={program}
                        onClick={() => setActivePage(program)}
                        className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                      >
                        {program}
                      </button>
                    ))}
                  </div>
                </form>
                <button
                  onClick={() => setIsAddProgramFormVisible(true)}
                  className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                >
                  Add
                </button>
                <button
                  onClick={() => setActivePage('Program Information')}
                  className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                >
                  Back
                </button>
    
                {isAddProgramFormVisible && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                      <textarea
                        value={newProgram}
                        onChange={(e) => setNewProgram(e.target.value)}
                        placeholder="Enter program name..."
                        className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                        rows={3}
                      />
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setIsAddProgramFormVisible(false)}
                          className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                          style={{
                            height: '35px',
                            width: '80px',
                            minHeight: '10px',
                            maxHeight: '50px',
                            padding: '0 10px',
                            lineHeight: '25px',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddProgram}
                          className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                          style={{
                            height: '35px',
                            width: '80px',
                            minHeight: '10px',
                            maxHeight: '50px',
                            padding: '0 10px',
                            lineHeight: '25px',
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
            );
            case 'Social and Behavioral Sciences Programs':
              return (
                <div className="flex flex-col items-center min-h-screen px-8">
                  <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">
                    College of Architecture and Design Programs
                  </h1>
                  <form className="bg-brown-1 p-6 h-96 rounded-lg shadow-lg w-full max-w-4xl">
                    <div className="grid grid-cols-3 gap-6">
                      {['Bachelor of Arts in Political Science',
                        'Bachelor of Science in Public Administration',
                        'Bachelor of Science in Criminology',

  
                        ].map((program) => (
                        <button
                          key={program}
                          onClick={() => setActivePage(program)}
                          className="bg-brown-6 text-white rounded-lg p-4 shadow-lg hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                        >
                          {program}
                        </button>
                      ))}
                    </div>
                  </form>
                  <button
                    onClick={() => setIsAddProgramFormVisible(true)}
                    className="fixed bottom-14 right-[350px] bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setActivePage('Program Information')}
                    className="fixed bottom-14 right-48 bg-brown-6 text-white rounded-lg p-4 shadow-lg w-36 hover:bg-brown-700 hover:scale-95 transition-transform duration-300 transform-gpu"
                  >
                    Back
                  </button>
      
                  {isAddProgramFormVisible && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                      <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-black">Add New Program</h2>
                        <textarea
                          value={newProgram}
                          onChange={(e) => setNewProgram(e.target.value)}
                          placeholder="Enter program name..."
                          className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
                          rows={3}
                        />
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setIsAddProgramFormVisible(false)}
                            className="btn btn-danger border-1 border-brown-6 bg-transparent hover:text-white text-black rounded px-4 py-0 hover:bg-brown-700 hover:border-brown-700"
                            style={{
                              height: '35px',
                              width: '80px',
                              minHeight: '10px',
                              maxHeight: '50px',
                              padding: '0 10px',
                              lineHeight: '25px',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddProgram}
                            className="btn btn-primary border-brown-6 bg-brown-6 text-white rounded px-5 py-2 hover:bg-brown-700 hover:border-brown-700"
                            style={{
                              height: '35px',
                              width: '80px',
                              minHeight: '10px',
                              maxHeight: '50px',
                              padding: '0 10px',
                              lineHeight: '25px',
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
              );
          
          
      case 'Registered User':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Registered Users</h1>
            <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="overflow-y-auto max-h-[450px] rounded-lg">
                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-brown-6 text-white">
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Username</th>
                      <th className="border border-gray-300 px-4 py-2">Personality Score</th>
                      <th className="border border-gray-300 px-4 py-2">Knowledge Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example data, replace with dynamic data */}
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user1</td>
                      <td className="border border-gray-300 px-4 py-2">85</td>
                      <td className="border border-gray-300 px-4 py-2">90</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">user2</td>
                      <td className="border border-gray-300 px-4 py-2">78</td>
                      <td className="border border-gray-300 px-4 py-2">88</td>
                    </tr>
                    {/* Add more rows dynamically */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Activity Log':
        return (
          <div className="flex flex-col items-center min-h-screen px-8">
            <h1 className="text-3xl font-bold mt-4 mb-8 text-center text-black">Log History</h1>
            <div className="bg-brown-1 p-6 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="overflow-y-auto max-h-[450px] rounded-lg">
                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-brown-6 text-white">
                      <th className="border border-gray-300 px-4 py-2">Log ID</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Login</th>
                      <th className="border border-gray-300 px-4 py-2">Logout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example data, replace with dynamic data */}
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 08:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 17:00</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 09:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 18:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">user3@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 10:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 19:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 08:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 17:00</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 09:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 18:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">user3@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 10:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 19:00</td>
                    </tr><tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 08:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 17:00</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 09:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 18:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">user3@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 10:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 19:00</td>
                    </tr><tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 08:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 17:00</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 09:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 18:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">user3@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 10:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 19:00</td>
                    </tr><tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">user1@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 08:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 17:00</td>
                    </tr>
                    <tr className="bg-gray-100 text-black">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">user2@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 09:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 18:00</td>
                    </tr>
                    <tr className="bg-white text-black">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">user3@example.com</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 10:00</td>
                      <td className="border border-gray-300 px-4 py-2">2023-10-01 19:00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Bachelor of Arts in Communication':
      case 'Bachelor of Arts in Political Science':
      case 'Bachelor of Arts in Philippine Studies':
      case 'Bachelor of Science in Social Work':
      case 'Bachelor of Science in Psychology':
      case 'Bachelor of Science in Accountancy':
      case 'Bachelor of Science in Management Accounting':
        // ...add cases for other programs...
        return renderProgramDetails(activePage);
      default:
        return <div>Select a menu item to view content.</div>;
    }
  };

  const logout = () => {
    // Logic for logout
    console.log('User logged out');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-300">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-brown-1 text-black transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } z-10 flex flex-col`}
      >
        <div
          className={`p-4 mt-4 flex items-center cursor-pointer ${
            isSidebarOpen ? 'justify-start' : 'justify-center'
          }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <>
              <Image src={Logo} alt="PathFinder Logo" width={50} height={50} />
              <span className="ml-4 text-xl font-bold">PathFinder</span>
              <FaBars className="ml-auto" size={20} />
            </>
          ) : (
            <FaBars size={20} />
          )}
        </div>
        <ul className={`flex-1 ${isSidebarOpen ? 'space-y-1' : 'space-y-4'}`}>
          <li
            className={`flex items-center cursor-pointer rounded mx-2 ${
              activePage === 'Dashboard' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
            } ${isSidebarOpen ? 'p-4' : 'p-3'}`}
            onClick={() => handleSidebarClick('Dashboard')}
          >
            <div
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <FaHome size={20} />
              {isSidebarOpen && <span className="ml-4 text-left">Dashboard</span>}
            </div>
          </li>
          <li
            className={`flex items-center cursor-pointer rounded mx-2 ${
              activePage === 'Registered User' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
            } ${isSidebarOpen ? 'p-4' : 'p-3'}`}
            onClick={() => handleSidebarClick('Registered User')}
          >
            <div
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <FaUser size={20} /> {/* Changed icon to FaUser */}
              {isSidebarOpen && <span className="ml-4 text-left">Registered User</span>}
            </div>
          </li>
          <li
            className={`flex items-center cursor-pointer rounded mx-2 ${
              activePage === 'Activity Log' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
            } ${isSidebarOpen ? 'p-4' : 'p-3'}`}
            onClick={() => handleSidebarClick('Activity Log')}
          >
            <div
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <FaFileAlt size={20} /> {/* Changed icon to FaFileAlt */}
              {isSidebarOpen && <span className="ml-4 text-left">Log History</span>}
            </div>
          </li>
          <li
            className={`flex items-center cursor-pointer rounded mx-2 ${
              activePage === 'Feedback' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
            } ${isSidebarOpen ? 'p-4' : 'p-3'}`}
            onClick={() => handleSidebarClick('Feedback')}
          >
            <div
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <FaComment size={20} />
              {isSidebarOpen && <span className="ml-4 text-left">Feedback</span>}
            </div>
          </li>
          <li>
            <div
              className={`flex items-center cursor-pointer rounded mx-2 hover:bg-brown-6 hover:text-white ${
                isSidebarOpen ? 'p-4' : 'p-3'
              }`}
              onClick={() => {
                setIsSidebarOpen(true);
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <div
                className={`flex items-center ${
                  isSidebarOpen ? 'justify-start' : 'justify-center'
                } w-full`}
              >
                <FaCog size={20} />
                {isSidebarOpen && <span className="ml-4 text-left">Settings</span>}
                {isSidebarOpen &&
                  (isSettingsOpen ? (
                    <FaChevronUp className="ml-auto text-xs" />
                  ) : (
                    <FaChevronDown className="ml-auto text-xs" />
                  ))}
              </div>
            </div>
            {isSidebarOpen && isSettingsOpen && (
              <ul className="ml-6 mt-2 space-y-1">
                <li
                  className={`flex justify-between items-center cursor-pointer rounded mx-2 hover:bg-brown-6 hover:text-white ${
                    isSidebarOpen ? 'p-3' : 'p-3'
                  }`}
                  onClick={() => setIsQuestionsOpen(!isQuestionsOpen)}
                >
                  <span>Questions</span>
                  {isQuestionsOpen ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </li>
                {isQuestionsOpen && (
                  <ul className="ml-4 mt-2 space-y-1">
                    <li
                      className={`cursor-pointer rounded mx-2 ${
                        activePage === 'Scholastic Record' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
                      } ${isSidebarOpen ? 'p-3' : 'p-3'}`}
                      onClick={() => handleSidebarClick('Scholastic Record')}
                    >
                      Scholastic Record
                    </li>
                    <li
                      className={`cursor-pointer rounded mx-2 ${
                        activePage === 'Personality Test' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
                      } ${isSidebarOpen ? 'p-3' : 'p-3'}`}
                      onClick={() => handleSidebarClick('Personality Test')}
                    >
                      Personality Test
                    </li>
                    <li
                      className={`cursor-pointer rounded mx-2 ${
                        activePage === 'Knowledge Test' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
                      } ${isSidebarOpen ? 'p-3' : 'p-3'}`}
                      onClick={() => handleSidebarClick('Knowledge Test')}
                    >
                      Knowledge Test
                    </li>
                  </ul>
                )}
                <div className="mt-2"></div>
                <li
                  className={`cursor-pointer rounded mx-2 ${
                    activePage === 'Program Information' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-white'
                  } ${isSidebarOpen ? 'p-3' : 'p-3'}`}
                  onClick={() => handleSidebarClick('Program Information')}
                >
                  Program Information
                </li>
              </ul>
            )}
          </li>
        </ul>
        <li
            className={`py-6 px-6 text-left w-full flex items-center gap-4 rounded-lg hover:scale-95 transition duration-200 bg-transparent hover:bg-transparent ${
              activePage === 'Registered User' ? 'bg-brown-6 text-white' : 'hover:bg-brown-6 hover:text-black'
            } ${isSidebarOpen ? 'p-3' : 'p-3'}`}
            onClick={() => setIsLogoutConfirmationOpen(true)}
          >
            <div
              className={`flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <FaSignOutAlt size={20} /> {/* Changed icon to FaUser */}
              {isSidebarOpen && <span className="ml-4 text-left">Logout</span>}
            </div>
          </li>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {/* Top Navigation */}
        <div className="bg-gray-300 text-white p-4 flex justify-center items-center">
          <div className="flex items-center">
            <Image src={Logo} alt="PathFinder Logo" width={80} height={80} />
            <h1 className="text-4xl text-black font-bold ml-4">PathFinder</h1>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-6">{renderContent()}</div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmationOpen && (
        <LogoutConfirmationModal
          isOpen={isLogoutConfirmationOpen}
          onClose={() => setIsLogoutConfirmationOpen(false)} // Close LogoutConfirmationModal
          onConfirm={() => {
            logout(); // Perform logout
            setIsLogoutConfirmationOpen(false); // Close LogoutConfirmationModal
            console.log('User confirmed logout'); // Debugging log
          }}
        />
      )}
    </div>
  );
}

