'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PersonalityTest = () => {
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]); // Ensure questions have both id and text
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<string | null>(null);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data); // Ensure the response contains both id and text
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  // Reinitialize answers whenever questions change
  useEffect(() => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = Array(questions.length).fill(null);
      for (let i = 0; i < Math.min(prevAnswers.length, questions.length); i++) {
        updatedAnswers[i] = prevAnswers[i];
      }
      return updatedAnswers;
    });
  }, [questions]);

  useEffect(() => {
    setShowNotification(true);
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

  const handleSubmit = () => {
    calculatePersonalityResult();
    setShowConfirmation(false);
    setShowResult(true);
  };

  const calculatePersonalityResult = () => {
    const agreeCount = answers.filter((answer) => answer === 'Agree').length;
    const disagreeCount = answers.filter((answer) => answer === 'Disagree').length;

    if (agreeCount > disagreeCount) {
      setPersonalityResult('You are a Goal-Oriented Personality!');
    } else if (disagreeCount > agreeCount) {
      setPersonalityResult('You are a Free-Spirited Personality!');
    } else {
      setPersonalityResult('You have a Balanced Personality!');
    }
  };

  const isNextDisabled = () => {
    return !selectedAnswer;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-8">
      {/* Step Notification */}
      {showNotification ? (
        <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
          <div className="bg-brown-1 pt-20 pb-16 pl-16 pr-16 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-10 text-center">Steps to Complete</h2>
            <ul className="list-decimal pl-8 mb-10 text-xl md:text-2xl lg:text-2xl">
              <li className="mb-4 flex items-center gap-4">
                <FaCheckCircle className="text-brown-6" size={26} />
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
                onClick={() => setShowNotification(false)}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded text-xl px-8 py-2 hover:bg-brown-700 hover:border-brown-700"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      ) : showResult ? (
        <div className="p-12 bg-brown-1 shadow-lg rounded w-full max-w-screen-md min-h-[50vh] flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-black">Your Personality Result</h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-center text-black">{personalityResult}</p>
          <button
            onClick={() => router.push('/KnowledgeTest')}
            className="mt-8 btn btn-primary bg-brown-6 h-16 w-36 border-brown-6 text-white rounded-lg px-6 py-3 hover:bg-brown-700 hover:border-brown-700"
          >
            Finish
          </button>
        </div>
      ) : (
        <div className="p-12 bg-brown-1 shadow-lg rounded w-full max-w-screen-md min-h-[50vh] flex flex-col justify-between relative">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-black">Personality Test</h1>
          <div className="absolute top-4 left-4 text-3xl md:text-3xl lg:text-4xl text-black font-bold">
            {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="relative flex items-center justify-center mt-10 mb-6">
            {questions.length > 0 ? (
              <p className="text-2xl md:text-3xl lg:text-4xl text-center text-black">
                {questions[currentQuestionIndex]?.text || 'Question text is missing.'}
              </p>
            ) : (
              <p className="text-center text-gray-500">No questions available. Please contact the administrator.</p>
            )}
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="flex justify-center gap-5 md:gap-8 lg:gap-12 mb-16">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value="Agree"
                  checked={selectedAnswer === 'Agree'}
                  onChange={() => handleAnswerSelection('Agree')}
                  className="radio w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10 border-black checked:bg-brown-1"
                />
                <span className="mt-2 text-lg md:text-xl lg:text-2xl text-black">Agree</span>
              </div>
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value="Disagree"
                  checked={selectedAnswer === 'Disagree'}
                  onChange={() => handleAnswerSelection('Disagree')}
                  className="radio w-8 md:w-9 lg:w-10 h-8 md:h-9 lg:h-10 border-black checked:bg-brown-1"
                />
                <span className="mt-2 text-lg md:text-xl lg:text-2xl text-black">Disagree</span>
              </div>
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
          </form>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
          <div className="bg-white pt-16 pb-10 pl-12 pr-10 rounded-lg shadow-md w-full max-w-lg md:max-w-xl lg:max-w-xl">
            <h2 className="text-3xl font-bold mb-8 items-center pr-0">Are you sure you want to submit?</h2>
            <div className="flex justify-end gap-5">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn btn-secondary bg-transparent border border-brown-6 text-black text-lg md:text-xl lg:text-xl rounded px-8 py-2 w-28 hover:bg-brown-700 hover:text-white hover:border-brown-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded-lg text-lg md:text-xl lg:text-xl px-8 py-2 w-28 hover:bg-brown-700 hover:border-brown-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityTest;
