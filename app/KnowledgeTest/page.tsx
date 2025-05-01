'use client';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const KnowledgeTest = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<
    { category: string; question: string; choices: string[]; correctAnswer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    id: number;
    question: string;
    choices: string[];
    correctAnswer: string;
  } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/knowledge-questions');
        if (response.status === 200) {
          const allQuestions = response.data.map((q: any) => ({
            ...q,
            options: JSON.parse(q.options), // Parse options from JSON
          }));

          // Group questions by category
          const groupedQuestions = allQuestions.reduce((acc: any, question: any) => {
            if (!acc[question.category]) acc[question.category] = [];
            acc[question.category].push({
              category: question.category,
              question: question.text,
              choices: question.options,
              correctAnswer: question.correctAnswer,
            });
            return acc;
          }, {});

          // Select 10 random questions from each category
          const selectedQuestions = Object.values(groupedQuestions).flatMap((categoryQuestions: any) =>
            categoryQuestions.sort(() => 0.5 - Math.random()).slice(0, 10)
          );

          setQuestions(selectedQuestions);
          setAnswers(Array(selectedQuestions.length).fill(null));
        }
      } catch (error) {
        console.error('Failed to fetch knowledge test questions:', error);
        alert('Failed to load questions. Please try again.');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(updatedAnswers);
      setSelectedAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleFinish = () => {
    setShowConfirmation(true);
  };

  const handleConfirmFinish = () => {
    const calculatedScore = answers.reduce((acc, answer, index) => {
      // Ensure both the selected answer and correct answer are trimmed and compared case-insensitively
      return answer?.trim().toLowerCase() === questions[index].correctAnswer.trim().toLowerCase()
        ? acc + 1
        : acc;
    }, 0);

    const scoresByCategory = questions.reduce((acc, question, index) => {
      const category = question.category;
      if (!acc[category]) acc[category] = 0;
      if (
        answers[index]?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
      ) {
        acc[category] += 1;
      }
      return acc;
    }, {} as Record<string, number>);

    setScore(calculatedScore);
    setCategoryScores(scoresByCategory);
    setShowConfirmation(false);
    setShowResult(true);
  };

  const handleCancelFinish = () => {
    setShowConfirmation(false);
  };

  const isNextDisabled = () => {
    return !selectedAnswer;
  };

  const handleSaveEdit = () => {
    // Save edit logic here
  };

  const handleDeleteQuestion = (id: number) => {
    // Delete question logic here
  };

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
                <span className="w-11 h-11 border-2 border-brown-6 rounded-full flex items-center justify-center text-brown-6">
                  3
                </span>
                Step 3: Knowledge Test
              </li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNotification(false)}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded text-xl px-8 py-2 hover:bg-brown-700 hover:border-brown-700"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      ) : showResult ? (
        <div className="p-16 bg-brown-1 shadow-lg rounded w-full max-w-screen-lg min-h-[70vh] flex flex-col justify-between items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-24 lg:mb-36 mt-2 text-center text-black">Your Knowledge Test Result</h1>
          <p className="text-3xl md:text-4xl lg:text-5xl text-center text-black mb-5">{score} out of {questions.length}</p>
          <div className="mt-6 w-full">
            <div className="hidden sm:block">
              <table className="border-collapse border border-black w-full text-center">
                <thead>
                  <tr>
                    {Object.keys(categoryScores).map((category, index) => (
                      <th key={index} className="border border-black px-4 py-2 md:text-2xl lg:text-3xl text-black">{category}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.entries(categoryScores).map(([category, categoryScore], index) => {
                      const totalQuestionsInCategory = questions.filter(q => q.category === category).length;
                      const percentage = ((categoryScore / totalQuestionsInCategory) * 100);
                      return (
                        <td key={index} className="border border-black px-4 py-2 text-3xl text-black">{percentage}%</td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="block sm:hidden">
              <table className="border-collapse border border-black w-full text-left">
                <tbody>
                  {Object.entries(categoryScores).map(([category, categoryScore], index) => {
                    const totalQuestionsInCategory = questions.filter(q => q.category === category).length;
                    const percentage = ((categoryScore / totalQuestionsInCategory) * 100);
                    return (
                      <tr key={index} className="border-b border-black">
                        <td className="border border-black px-2 py-2 text-lg font-bold text-black">{category}</td>
                        <td className="border border-black px-2 py-2 text-lg text-black">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={() => router.push('/result')}
            className="mt-auto lg:mt-16 mb-4 md:mb-10 lg:mb-16 btn btn-primary bg-brown-6 h-10 md:h-16 lg:h-16 w-36 md:w-44 lg:w-48 text-lg md:text-xl lg:text-2xl border-brown-6 text-white rounded-lg px-6 py-3 hover:bg-brown-700 hover:border-brown-700"
          >
            Finish
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-screen-md">
          <div className="p-12 bg-brown-1 shadow-lg rounded min-h-[50vh] flex flex-col justify-between relative">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-black">Knowledge Test</h1>
            <div className="absolute top-4 left-4 text-3xl md:text-3xl lg:text-4xl text-black font-bold">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="relative flex flex-col items-center justify-center mt-16 mb-10">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-black">
                {questions[currentQuestionIndex]?.question}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28 lg:justify-items-center md:justify-items-center">
              {questions[currentQuestionIndex]?.choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-4 h-12">
                  <div className="flex items-center justify-center w-10 h-10 shrink-0">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={choice}
                      checked={selectedAnswer === choice}
                      onChange={() => handleAnswerSelection(choice)}
                      className="radio w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10 border-black checked:bg-brown-1"
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <label className="text-xl md:text-2xl lg:text-3xl text-black leading-tight">{choice}</label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 absolute bottom-4 right-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className={`btn-sm btn-secondary text-black bg-transparent border border-brown-6 rounded-lg text-[10px] md:text-[15px] lg:text-[16px] w-[80px] md:w-[120px] lg:w-[130px] h-[28px] md:h-[35px] lg:h-[35px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu hover:text-white ${
                  currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={currentQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
                disabled={isNextDisabled()}
                className={`btn-sm btn-primary text-white bg-brown-6 rounded-lg border-brown-6 text-[10px] md:text-[15px] lg:text-[16px] w-[80px] md:w-[120px] lg:w-[130px] h-[28px] md:h-[35px] lg:h-[35px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu ${
                  isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
          <div className="bg-white pt-16 pb-10 pl-12 pr-10 rounded-lg shadow-md w-full max-w-lg md:max-w-xl lg:max-w-xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 items-center pr-0">Are you sure you want to submit?</h2>
            <div className="flex justify-end gap-5">
              <button
                onClick={handleCancelFinish}
                className="btn btn-secondary bg-transparent border border-brown-6 text-black rounded-lg text-lg md:text-xl lg:text-xl w-28  px-8 py-2 hover:bg-brown-6 hover:text-white hover:border-brown-6"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFinish}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded-lg text-lg md:text-xl lg:text-xl px-8 py-2 w-28 hover:bg-brown-700 hover:border-brown-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditing && editingQuestion && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Edit Question</h2>
            <textarea
              value={editingQuestion.question}
              onChange={(e) =>
                setEditingQuestion((prev) => prev && { ...prev, question: e.target.value })
              }
              className="w-full p-4 border rounded-lg bg-gray-200 text-black mb-4"
              rows={3}
            />
            <div className="mb-4">
              {editingQuestion.choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => {
                      const updatedChoices = [...editingQuestion.choices];
                      updatedChoices[index] = e.target.value;
                      setEditingQuestion((prev) => prev && { ...prev, choices: updatedChoices });
                    }}
                    className="w-full p-2 border rounded-lg bg-gray-200 text-black"
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-black font-bold mb-2">Correct Answer:</label>
              <select
                value={editingQuestion.correctAnswer}
                onChange={(e) =>
                  setEditingQuestion((prev) => prev && { ...prev, correctAnswer: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-gray-200 text-black"
              >
                {editingQuestion.choices.map((choice, index) => (
                  <option key={index} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary bg-brown-6 text-white rounded-lg p-2 shadow-lg hover:bg-brown-700"
              >
                Save
              </button>
              <button
                onClick={() => handleDeleteQuestion(editingQuestion.id)}
                className="btn btn-danger bg-red-600 text-white rounded-lg p-2 shadow-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeTest;
