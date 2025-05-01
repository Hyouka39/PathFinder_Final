'use client';
import React, { useState, useEffect } from 'react';
import ChangePasswordModal from './ChangePasswordModal'; // Import ChangePasswordModal
import LogoutConfirmationModal from './LogoutConfirmationModal'; // Import LogoutConfirmationModal
import { FaTimes, FaChevronDown, FaUserCircle, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaBell, FaFileAlt, FaPencilAlt, FaStar } from 'react-icons/fa'; // Import icons
import { MdHelpOutline } from 'react-icons/md'; // Import MdHelpOutline for feedback icon
import { useAuth } from '@/app/context/AuthContext'; // Import useAuth for logout

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string; // Add optional initialSection prop
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, initialSection = 'Profile' }) => {
  const { logout } = useAuth(); // Access the logout function
  const [activeSection, setActiveSection] = useState(initialSection); // Use initialSection as default
  const [email, setEmail] = useState('andrewglenthgarcia2@gmail.com');
  const [username, setUsername] = useState('Drew27');
  const [firstName, setFirstName] = useState('Andrew');
  const [middleName, setMiddleName] = useState('Glenth');
  const [lastName, setLastName] = useState('Garcia');
  const [extension, setExtension] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false); // Add state for LogoutConfirmationModal
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [faqs] = useState([
    { question: "What is PathFinder?", answer: "PathFinder is a web-based system that recommends three suitable college programs for Senior High School (SHS) graduates based on their personality, knowledge, and scholastic records." },
    { question: "Who can use PathFinder?", answer: "PathFinder is specifically designed for SHS graduates from the ABM, STEM, and HUMSS strands." },
    { question: "How does PathFinder work?", answer: "The system analyzes your inputs from a personality test, knowledge assessment, and academic performance to suggest three best-fit college programs." },
    { question: "Is PathFinder free to use?", answer: "Yes, PathFinder is completely free to use for all users." },
    { question: "Do I need to create an account to use PathFinder?", answer: "Yes, you need to create an account to access the features and receive personalized program recommendations." },
    { question: "What kind of recommendations will I receive?", answer: "PathFinder will suggest three college programs that are most aligned with your strengths, interests, and academic background." },
    { question: "Are the results saved?", answer: "Yes, your results and progress are saved to your account for future reference." },
    { question: "Can I edit my profile?", answer: "Yes, you can update your personal information anytime after logging into your account." },
    { question: "Is my data secure on PathFinder?", answer: "Yes, we prioritize user privacy and ensure that your data is securely stored and not shared without your consent." },
    { question: "Can I use PathFinder on mobile devices?", answer: "Yes, PathFinder is fully responsive and can be accessed through smartphones, tablets, and desktops." },
    { question: "How long does the assessment take?", answer: "The full assessment usually takes around 3 hours to complete." },
    { question: "Can I get a copy of my recommended programs?", answer: "Yes, you can view and download your recommended programs once the assessment is complete." }
  ]);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false); // Add state for save confirmation
  const [recommendedPrograms] = useState([
    { program: "Computer Science", personalityScore: 85, knowledgeScore: 90 },
    { program: "Business Administration", personalityScore: 80, knowledgeScore: 85 },
    { program: "Psychology", personalityScore: 88, knowledgeScore: 82 },
  ]);
  const [personalityType] = useState("Social"); // Example personality type
  const [knowledgePercentage] = useState(85); // Example knowledge test percentage
    const [isEditing, setIsEditing] = useState(false); // Add state for editing mode
  const [originalProfile, setOriginalProfile] = useState({
    email,
    username,
    firstName,
    middleName,
    lastName,
    extension,
  }); // Store original profile data
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // Add state for feedback modal
  const [rating, setRating] = useState<number | null>(null); // Add state for rating
  const [comments, setComments] = useState(''); // Add state for comments

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaveConfirmationOpen(true); // Open save confirmation popup
  };

  const confirmSave = () => {
    console.log('Profile saved:', { email, username, firstName, middleName, lastName, extension });
    setIsSaveConfirmationOpen(false); // Close confirmation popup
    setActiveSection('Profile'); // Return to viewing state
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Revert changes if canceling
      setEmail(originalProfile.email);
      setUsername(originalProfile.username);
      setFirstName(originalProfile.firstName);
      setMiddleName(originalProfile.middleName);
      setLastName(originalProfile.lastName);
      setExtension(originalProfile.extension);
    } else {
      // Save current state as original when entering edit mode
      setOriginalProfile({ email, username, firstName, middleName, lastName, extension });
    }
    setIsEditing(!isEditing); // Toggle editing mode
  };

  useEffect(() => {
    setActiveSection(initialSection); // Update active section when initialSection changes
  }, [initialSection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-300 rounded-3xl shadow-lg w-[70vw] h-[90vh] relative overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-brown-1 text-black flex flex-col overflow-y-auto rounded-3xl"> {/* Increased width and added rounded-xl */}
          <div className="flex flex-col items-center mt-8 mb-4">
            <FaUserCircle className="text-9xl mb-6 mt-6" />
            <p className="text-2xl font-semibold mb-4">Welcome, {username}</p>
          </div>
          <div className="flex flex-col mt-4 gap-4 px-4"> {/* Added gap and padding */}
            <button
              className={`py-6 px-6 text-left w-full flex items-center gap-8 rounded-lg ${
                activeSection === 'Profile' ? 'bg-brown-6 text-white' : 'bg-transparent hover:bg-brown-6 hover:text-white'
              }`}
              onClick={() => setActiveSection('Profile')}
            >
              <FaUser className={`text-4xl ${activeSection === 'Profile' ? 'text-white' : ''}`} /> 
              <span>Profile</span>
            </button>
            <button
              className={`py-6 px-6 text-left w-full flex items-center gap-8 rounded-lg ${
                activeSection === 'Result' ? 'bg-brown-6 text-white' : 'bg-transparent hover:bg-brown-6 hover:text-white'
              }`}
              onClick={() => setActiveSection('Result')}
            >
              <FaFileAlt className={`text-4xl ${activeSection === 'Result' ? 'text-white' : ''}`} /> 
              <span>Result</span>
            </button>
            <button
              className={`py-6 px-6 text-left w-full flex items-center gap-8 rounded-lg ${
                activeSection === 'Settings' ? 'bg-brown-6 text-white' : 'bg-transparent hover:bg-brown-6 hover:text-white'
              }`}
              onClick={() => setActiveSection('Settings')}
            >
              <FaCog className={`text-4xl ${activeSection === 'Settings' ? 'text-white' : ''}`} /> 
              <span>Settings</span>
            </button>
            <button
              className={`py-6 px-6 text-left w-full flex items-center gap-8 rounded-lg ${
                activeSection === 'Feedback' ? 'bg-brown-6 text-white' : 'bg-transparent hover:bg-brown-6 hover:text-white'
              }`}
              onClick={() => setActiveSection('Feedback')}
            >
              <FaPencilAlt className={`text-4xl ${activeSection === 'Feedback' ? 'text-white' : ''}`} />
              <span>Feedback</span>
            </button>
            <button
              className={`py-6 px-6 text-left w-full flex items-center gap-8 rounded-lg ${
                activeSection === 'Help' ? 'bg-brown-6 text-white' : 'bg-transparent hover:bg-brown-6 hover:text-white'
              }`}
              onClick={() => setActiveSection('Help')}
            >
              <FaQuestionCircle className={`text-4xl ${activeSection === 'Help' ? 'text-white' : ''}`} /> 
              <span>FAQ</span>
            </button>
          </div>
          <div className="mt-auto px-4"> {/* Added padding for alignment */}
            <button
              className="py-6 px-6 text-left w-full flex items-center gap-4 rounded-lg hover:scale-95 transition duration-200 bg-transparent hover:bg-transparent"
              onClick={() => setIsLogoutConfirmationOpen(true)}
            >
              <FaSignOutAlt className="text-4xl" /> <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 relative overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-black hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Render content based on active section */}
          {activeSection === 'Profile' && (
            <div>
              <h2 className="text-6xl mt-14 font-semibold text-center text-black">Profile</h2>
              <div className="overflow-y-auto h-[calc(100%-120px)] p-6">
                <form className="grid grid-cols-2 gap-8 bg-brown-1 p-6 rounded-3xl h-full pl-28" onSubmit={handleSave}>
                  <div className="form-control mt-6 col-span-2">
                    <label className="label">
                      <span className="label-text text-3xl ml-10 mb-2 font-bold text-black">Email</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-[518px] p-6 border rounded-2xl shadow-xl ml-5 focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  <div className="form-control col-span-2">
                    <label className="label">
                      <span className="label-text text-3xl ml-10 mb-2 font-bold text-black">Username</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-[518px] p-6 border rounded-2xl shadow-xl ml-5 focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  <div className="form-control mt-[18px]">
                    <label className="label">
                      <span className="label-text text-2xl ml-10 font-bold text-black">First Name</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-3/4 p-6 border rounded-2xl shadow-xl ml-5 focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  <div className="form-control mt-[18px]">
                    <label className="label">
                      <span className="label-text text-2xl ml-5 font-bold text-black">Middle Name</span>
                    </label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-3/4 p-6 border rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-2xl ml-10 font-bold text-black">Last Name</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-3/4 p-6 border rounded-2xl shadow-xl ml-5 focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-2xl ml-5 font-bold text-black">Ext.</span>
                    </label>
                    <input
                      type="text"
                      value={extension}
                      onChange={(e) => setExtension(e.target.value)}
                      disabled={!isEditing} // Disable input when not editing
                      className="w-3/4 p-6 border rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    />
                  </div>
                  
                  <div className="col-span-2 flex justify-end gap-5">
                    <button
                      type="button"
                      onClick={handleEditToggle} // Toggle edit mode
                      className="px-14 py-3 bg-transparent border-2 border-brown-6 text-black hover:text-white hover:border-brown-700 font-semibold rounded-lg hover:bg-brown-700 transition duration-300 hover:scale-95"
                    >
                      {isEditing ? 'Cancel' : 'Edit'} {/* Change button text */}
                    </button>
                    <button
                      type="submit"
                      disabled={!isEditing} // Disable save button when not editing
                      className={`px-12 py-3 bg-brown-6 text-white font-semibold rounded-lg transition duration-300 hover:scale-95 ${
                        isEditing ? 'hover:bg-brown-700' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Save Confirmation Popup */}
          {isSaveConfirmationOpen && (
            <div className="fixed inset-0 flex justify-center items-center text-black bg-black bg-opacity-50">
            <div className="bg-white pt-16 pb-10 pl-12 pr-10 rounded-lg shadow-md w-full max-w-lg md:max-w-xl lg:max-w-xl">
              <h2 className="text-3xl font-bold mb-8 items-center pr-0">Are you sure you want to submit?</h2>
              <div className="flex justify-end gap-5">
                <button
                  onClick={() => setIsSaveConfirmationOpen(false)}
                  className="btn btn-secondary bg-transparent border border-brown-6 text-black text-lg md:text-xl lg:text-xl rounded px-8 py-2 w-28 hover:bg-brown-700 hover:text-white hover:border-brown-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="btn btn-primary bg-brown-6 border-brown-6 text-white rounded-lg text-lg md:text-xl lg:text-xl px-8 py-2 w-28 hover:bg-brown-700 hover:border-brown-700"
                >
                  confirm
                </button>
              </div>
            </div>
          </div>
          )}

          {activeSection === 'Settings' && (
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-6xl mt-8 font-semibold mb-8 text-center text-black">Settings</h2>
              <form className="bg-brown-1 w-full h-[calc(100%-70px)] p-10 rounded-3xl flex flex-col items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)} // Open ChangePasswordModal
                  className="w-[500px] flex h-28 justify-between items-center shadow-xl bor hover:border-brown-2 text-left text-2xl font-semibold bg-white text-black border rounded-3xl p-4 hover:scale-105 transition duration-200 hover:bg-brown-2"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="w-[500px] flex h-28 justify-between items-center shadow-xl hover:border-brown-2 text-left text-2xl font-semibold bg-white text-black border rounded-3xl p-4 hover:scale-105 transition duration-200 hover:bg-brown-2"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  <span className="flex items-center gap-4">
                    <FaCog className="text-3xl" /> Dark Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    readOnly
                    className="toggle w-16 h-10 toggle-error bg-gray-300 checked:bg-brown-6"
                  />
                </button>
                <button
                  type="button"
                  className="w-[500px] flex h-28 justify-between items-center shadow-xl hover:border-border-2 text-left text-2xl font-semibold bg-white text-black border rounded-3xl p-4 hover:scale-105 transition duration-200 hover:bg-brown-2"
                  onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                >
                  <span className="flex items-center gap-4">
                    <FaBell className="text-3xl" /> Enable Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={isNotificationsEnabled}
                    readOnly
                    className="toggle w-16 h-10 toggle-primary bg-gray-300 checked:bg-brown-6"
                  />
                </button>
              </form>
              <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)} // Close ChangePasswordModal
              />
            </div>
          )}

          {activeSection === 'Help' && (
            <div className="p-6">
              <h2 className="text-5xl font-bold mb-8 mt-14 text-center text-black">Frequently Asked Questions</h2>
              <form className="bg-brown-1 p-6 rounded-3xl">
                <div className="flex flex-col items-center mt-20 mb-20">
                  {faqs.map((faq, index) => (
                    <div key={index} className="mb-4 flex flex-col items-center">
                      <button
                        className="w-[500px] flex h-24 justify-between items-center shadow-xl hover:border-brown-2 text-left text-2xl font-semibold bg-white text-black border rounded-3xl p-4 hover:scale-105 transition duration-200 hover:bg-brown-2"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleQuestion(index);
                        }}
                      >
                        {faq.question}
                        <FaChevronDown className={`transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`} />
                      </button>
                      {activeQuestion === index && (
                        <div className="w-[500px] mt-2 p-3 bg-brown-2 shadow-xl text-black border rounded-lg">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </div>
          )}

          {activeSection === 'Result' && (
            <div className="p-6">
              <h2 className="text-5xl font-bold mb-8 mt-14 text-center text-black">Recommended Programs</h2>
              <div className="bg-brown-1 p-6 rounded-3xl">
                <div className="flex flex-col items-center gap-6">
                  {recommendedPrograms.map((program, index) => (
                    <button
                      key={index}
                      className="w-full h-[85px] flex justify-center items-center shadow-xl bg-white text-black border hover:bg-brown-2 rounded-3xl p-6 text-2xl font-semibold hover:scale-105 transition duration-200"
                    >
                      {program.program}
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-center gap-10">
                  <button className="w-full h-80 flex justify-center items-center shadow-xl hover:bg-brown-2 bg-white text-black border rounded-3xl text-xl font-semibold hover:scale-105 transition duration-200">
                    Personality: {personalityType}
                  </button>
                  <button className="w-full h-80 flex justify-center items-center shadow-xl hover:bg-brown-2 bg-white text-black border rounded-3xl text-xl font-semibold hover:scale-105 transition duration-200">
                    Knowledge: {knowledgePercentage}%
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Feedback' && (
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-6xl mt-8 font-semibold mb-8 text-center text-black">Feedback</h2>
              <form className="bg-brown-1 w-full h-[calc(100%-70px)] p-10 rounded-3xl flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <label className="text-3xl font-semibold mb-4 text-black">Rate Us</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-6xl ${rating !== null && rating >= star ? 'text-brown-6' : 'text-gray-400'}`} // Increased size to text-5xl
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-3xl font-semibold mb-4 text-black">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full h-40 p-4 border rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                    placeholder="Write your feedback here..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Feedback submitted:', { rating, comments });
                    setRating(null);
                    setComments('');
                    setActiveSection('Profile'); // Return to Profile after submission
                  }}
                  className="px-12 py-3 bg-brown-6 text-white font-semibold rounded-lg transition duration-300 hover:scale-95 hover:bg-brown-700"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          {isLogoutConfirmationOpen && (
            <LogoutConfirmationModal
              isOpen={isLogoutConfirmationOpen}
              onClose={() => setIsLogoutConfirmationOpen(false)} // Close LogoutConfirmationModal
              onConfirm={() => {
                logout(); // Perform logout
                setIsLogoutConfirmationOpen(false); // Close LogoutConfirmationModal
                onClose(); // Close the ProfileModal
                console.log('User confirmed logout'); // Debugging log
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
