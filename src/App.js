import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showChallengeIntro, setShowChallengeIntro] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState('');
  const [showOtherSection, setShowOtherSection] = useState(false);
  const [showOtherSection5a, setShowOtherSection5a] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [previousPage, setPreviousPage] = useState('');
  const [activeTab, setActiveTab] = useState('privacy');
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [termsConsent, setTermsConsent] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [lastThankYouType, setLastThankYouType] = useState('');

  const totalQuestions = 9;

  // Cookie consent functions
  const acceptCookies = () => {
    setCookiesAccepted(true);
    setShowCookieBanner(false);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const declineCookies = () => {
    setCookiesAccepted(false);
    setShowCookieBanner(false);
    localStorage.setItem('cookiesAccepted', 'false');
  };

  const acceptNecessaryCookies = () => {
    setCookiesAccepted('necessary');
    setShowCookieBanner(false);
    localStorage.setItem('cookiesAccepted', 'necessary');
  };

  // Check for existing cookie consent and survey completion on component mount
  useEffect(() => {
    const savedCookieConsent = localStorage.getItem('cookiesAccepted');
    const savedSurveyCompleted = localStorage.getItem('surveyCompleted');
    const savedLastThankYouType = localStorage.getItem('lastThankYouType');
    
    if (savedCookieConsent) {
      setCookiesAccepted(savedCookieConsent === 'true' ? true : savedCookieConsent === 'necessary' ? 'necessary' : false);
      setShowCookieBanner(false);
    }
    
    if (savedSurveyCompleted === 'true') {
      setSurveyCompleted(true);
    }
    
    if (savedLastThankYouType) {
      setLastThankYouType(savedLastThankYouType);
    }
  }, []);

  // Handle browser back/forward navigation and route changes
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      // Home page
      setShowSurvey(false);
      setShowThankYou(false);
      setShowAbout(false);
      setShowPrivacy(false);
      setThankYouType('');
      setCurrentQuestion(0);
      setShowChallengeIntro(false);
      setChallengeCompleted(null);
      setAnswers({});
      setShowOtherSection(false);
      setShowOtherSection5a(false);
      setShowEmailSection(false);
      setShowMediaSection(false);
      setSelectedFile(null);
      setShowCheckmark(false);
      setErrors({});
    } else if (path.startsWith('/thank-you/')) {
      // Thank you page
      const thankYouTypeFromPath = path.split('/')[2];
      setShowThankYou(true);
      setThankYouType(thankYouTypeFromPath);
      setShowSurvey(false);
      setShowAbout(false);
      setShowPrivacy(false);
      setCurrentQuestion(0);
      setShowChallengeIntro(false);
      setChallengeCompleted(null);
      setAnswers({});
      setShowOtherSection(false);
      setShowOtherSection5a(false);
      setShowEmailSection(false);
      setShowMediaSection(false);
      setSelectedFile(null);
      setShowCheckmark(false);
      setErrors({});
    } else if (path === '/about') {
      // About page
      setShowAbout(true);
      setShowSurvey(false);
      setShowThankYou(false);
      setShowPrivacy(false);
      setCurrentQuestion(0);
      setShowChallengeIntro(false);
      setChallengeCompleted(null);
      setAnswers({});
      setShowOtherSection(false);
      setShowOtherSection5a(false);
      setShowEmailSection(false);
      setShowMediaSection(false);
      setSelectedFile(null);
      setShowCheckmark(false);
      setErrors({});
    } else if (path === '/privacy') {
      // Privacy page
      setShowPrivacy(true);
      setShowSurvey(false);
      setShowThankYou(false);
      setShowAbout(false);
      setCurrentQuestion(0);
      setShowChallengeIntro(false);
      setChallengeCompleted(null);
      setAnswers({});
      setShowOtherSection(false);
      setShowOtherSection5a(false);
      setShowEmailSection(false);
      setShowMediaSection(false);
      setSelectedFile(null);
      setShowCheckmark(false);
      setErrors({});
    } else if (path.startsWith('/survey/')) {
      // Survey pages
      if (path === '/survey/intro') {
        setShowSurvey(true);
        setCurrentQuestion(0);
        setShowChallengeIntro(true);
        setShowThankYou(false);
        setShowAbout(false);
        setShowPrivacy(false);
      } else if (path.startsWith('/survey/question/')) {
        const questionNum = path.split('/')[3];
        setShowSurvey(true);
        setCurrentQuestion(questionNum);
        setShowChallengeIntro(false);
        setShowThankYou(false);
        setShowAbout(false);
        setShowPrivacy(false);
      }
    }
  }, [location.pathname]);



  useEffect(() => {
    if (showChallengeIntro && currentQuestion === 0) {
      const timer = setTimeout(() => {
        setShowChallengeIntro(false);
        setCurrentQuestion(1);
        navigate('/survey/question/1');
      }, 2250);
      return () => clearTimeout(timer);
    }
  }, [showChallengeIntro, currentQuestion, navigate]);



  const startSurvey = () => {
    if (surveyCompleted) {
      // If survey is already completed, show the appropriate thank you page
      setShowThankYou(true);
      setThankYouType(lastThankYouType || 'completed');
      navigate(`/thank-you/${lastThankYouType || 'completed'}`);
      return;
    }
    
    setShowSurvey(true);
    setCurrentQuestion(0); // Reset to ensure clean state
    setShowChallengeIntro(true);
    navigate('/survey/intro');
  };

  const showNotInterested = () => {
    if (surveyCompleted) {
      // If survey is already completed, show the appropriate thank you page
      setShowThankYou(true);
      setThankYouType(lastThankYouType || 'not-interested');
      navigate(`/thank-you/${lastThankYouType || 'not-interested'}`);
      return;
    }
    
    setShowSurvey(true);
    setShowThankYou(true);
    setThankYouType('not-interested');
    setLastThankYouType('not-interested');
    setSurveyCompleted(true);
    localStorage.setItem('surveyCompleted', 'true');
    localStorage.setItem('lastThankYouType', 'not-interested');
    navigate('/thank-you/not-interested');
  };

  const goBackToMain = () => {
    setShowSurvey(false);
    setShowThankYou(false);
    setShowAbout(false);
    setShowPrivacy(false);
    setThankYouType('');
    setCurrentQuestion(0);
    setShowChallengeIntro(false);
    setChallengeCompleted(null);
    setAnswers({});
    setShowOtherSection(false);
    setShowOtherSection5a(false);
    setShowEmailSection(false);
    setShowMediaSection(false);
    setSelectedFile(null);
    setShowCheckmark(false);
    setErrors({});
    navigate('/');
  };

  const resetSurvey = () => {
    setSurveyCompleted(false);
    setLastThankYouType('');
    localStorage.removeItem('surveyCompleted');
    localStorage.removeItem('lastThankYouType');
    setShowSurvey(false);
    setShowThankYou(false);
    setShowAbout(false);
    setShowPrivacy(false);
    setThankYouType('');
    setCurrentQuestion(0);
    setShowChallengeIntro(false);
    setChallengeCompleted(null);
    setAnswers({});
    setShowOtherSection(false);
    setShowOtherSection5a(false);
    setShowEmailSection(false);
    setShowMediaSection(false);
    setSelectedFile(null);
    setShowCheckmark(false);
    setErrors({});
    navigate('/');
  };

  const goBack = () => {
    if (currentQuestion === 1) {
      setShowSurvey(false);
      setShowChallengeIntro(false);
      setCurrentQuestion(0);
      navigate('/');
    } else if (currentQuestion === 2) {
      setCurrentQuestion(1);
      navigate('/survey/question/1');
    } else if (currentQuestion === 3) {
      setCurrentQuestion(2);
      navigate('/survey/question/2');
    } else if (currentQuestion === '4a') {
      setCurrentQuestion(3);
      navigate('/survey/question/3');
    } else if (currentQuestion === '4b') {
      setCurrentQuestion(3);
      navigate('/survey/question/3');
    } else if (currentQuestion === '4b-other') {
      setShowOtherSection(false);
      setCurrentQuestion('4b');
      navigate('/survey/question/4b');
    } else if (currentQuestion === '5a') {
      setCurrentQuestion('4a');
      navigate('/survey/question/4a');
    } else if (currentQuestion === '5c') {
      setCurrentQuestion('5a');
      navigate('/survey/question/5a');
    } else if (currentQuestion === '5b') {
      if (showEmailSection) {
        setShowEmailSection(false);
        setCurrentQuestion('5b');
        navigate('/survey/question/5b');
      } else {
        setCurrentQuestion('4b');
        navigate('/survey/question/4b');
      }
    } else if (currentQuestion === '5b-email') {
      setShowEmailSection(false);
      setCurrentQuestion('5b');
      navigate('/survey/question/5b');
    } else if (currentQuestion === 6) {
      if (challengeCompleted === 'Yes') {
        setCurrentQuestion('5c');
        navigate('/survey/question/5c');
      } else {
        setCurrentQuestion('5b');
        navigate('/survey/question/5b');
      }
    } else if (currentQuestion === 7) {
      setCurrentQuestion(6);
      navigate('/survey/question/6');
    } else if (currentQuestion === 8) {
      setCurrentQuestion(7);
      navigate('/survey/question/7');
    }
  };

  const updateProgress = () => {
    let progress = 0;
    if (showThankYou && thankYouType !== 'not-interested') progress = 100;
    else if (currentQuestion === 1) progress = 0;
    else if (currentQuestion === 2) progress = 12.5;
    else if (currentQuestion === 3) progress = 25;
    else if (currentQuestion === '4a') progress = 37.5;
    else if (currentQuestion === '5a') progress = 50;
    else if (currentQuestion === '5c') progress = 56.25;
    else if (currentQuestion === '4b') progress = 37.5;
    else if (currentQuestion === '4b-other') progress = 43.75;
    else if (currentQuestion === '5b') progress = 50;
    else if (currentQuestion === '5b-email') progress = 62.5;
    else if (currentQuestion === 6) progress = 68.75;
    else if (currentQuestion === 7) progress = 75;
    else if (currentQuestion === 8) progress = 87.5;
    return progress;
  };

  const validateAndContinue = (questionNumber, suffix = '') => {
    const questionId = suffix ? `${questionNumber}${suffix}` : questionNumber;
    let errorKey = (questionNumber === 1 || questionNumber === 2 || questionId === '4b-other' || questionId === '5b-email') ? `answer${questionId}` : `question${questionId}`;
    
    // Special case for 4b Other
    if (questionId === '4b' && answers.question4b === 'Other') {
      errorKey = 'answer4b-other';
    }
    
    // Special case for 5a Other
    if (questionId === '5a' && answers.question5a === 'Other') {
      errorKey = 'answer5a-other';
    }
    
    let isValid = false;

    if (questionNumber === 1 || questionNumber === 2) {
      const answer = answers[`answer${questionId}`] || '';
      isValid = answer.trim().length > 0;
      console.log(`Question ${questionId}: answer="${answer}", isValid=${isValid}`);
    } else if (questionNumber === 3) {
      isValid = answers[`question${questionNumber}`] !== undefined;
    } else if (questionId === '5a') {
      if (answers.question5a === 'Other') {
        const answer = answers['answer5a-other'] || '';
        isValid = answer.trim().length > 0;
        errorKey = 'answer5a-other';
      } else {
        isValid = answers.question5a !== undefined;
      }
    } else if (questionId === '4a') {
      isValid = answers.question4a !== undefined;
    } else if (questionId === '4b') {
      if (answers.question4b === 'Other') {
        const answer = answers['answer4b-other'] || '';
        isValid = answer.trim().length > 0;
        errorKey = 'answer4b-other';
      } else {
        isValid = answers.question4b !== undefined;
      }
    } else if (questionId === '5b') {
      if (answers.question5b === 'Yes') {
        const answer = answers['answer5b-email'] || '';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;
        isValid = answer.trim().length > 0 && emailRegex.test(answer);
        errorKey = 'answer5b-email';
      } else {
        isValid = answers.question5b !== undefined;
      }
    } else if (questionId === '5c') {
      isValid = answers.question5c !== undefined;
    } else if (questionNumber === 6) {
      isValid = answers.question6 !== undefined;
      errorKey = 'question6';
    } else if (questionNumber === 7) {
      const age = answers.age || '';
      const ageNum = parseInt(age);
      isValid = age.trim().length > 0 && !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
      errorKey = 'age';
    } else if (questionNumber === 8) {
      const gender = answers.gender || '';
      const hasGender = gender.trim().length > 0;
      const hasConsent = termsConsent;
      isValid = hasGender && hasConsent;
      errorKey = hasGender ? 'consent' : 'gender';
    }

    if (isValid) {
      setErrors({ ...errors, [errorKey]: false });
      
      if (questionNumber === 1) {
        setCurrentQuestion(2);
        navigate('/survey/question/2');
      } else if (questionNumber === 2) {
        setCurrentQuestion(3);
        navigate('/survey/question/3');
      } else if (questionNumber === 3) {
        if (challengeCompleted === 'Yes') {
          setCurrentQuestion('4a');
          navigate('/survey/question/4a');
        } else {
          setCurrentQuestion('4b');
          navigate('/survey/question/4b');
        }
      } else if (questionId === '4a') {
        setCurrentQuestion('5a');
        navigate('/survey/question/5a');
      } else if (questionId === '4b') {
        setCurrentQuestion('5b');
        navigate('/survey/question/5b');
      } else if (questionId === '4b-other') {
        setCurrentQuestion('5b');
        navigate('/survey/question/5b');
      } else if (questionId === '5a') {
        setCurrentQuestion('5c');
        navigate('/survey/question/5c');
      } else if (questionId === '5c') {
        setCurrentQuestion(6);
        navigate('/survey/question/6');
      } else if (questionId === '5b') {
        setCurrentQuestion(6);
        navigate('/survey/question/6');
      } else if (questionNumber === 6) {
        setCurrentQuestion(7);
        navigate('/survey/question/7');
      } else if (questionNumber === 7) {
        setCurrentQuestion(8);
        navigate('/survey/question/8');
      } else if (questionNumber === 8) {
        completeSurvey();
      }
    } else {
      console.log(`Setting error for ${errorKey}`);
      setErrors({ ...errors, [errorKey]: true });
      
      // Trigger shake animation to replay
      if (questionNumber === 1 || questionNumber === 2 || questionNumber === 3 || questionId === '4a' || questionId === '4b' || questionId === '4b-other' || questionId === '5a' || questionId === '5a-other' || questionId === '5c' || questionId === '5b' || questionId === '5b-email' || questionNumber === 6 || questionNumber === 7 || questionNumber === 8) {
        setShakeTrigger(prev => prev + 1);
      }
    }
  };

  const selectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    setErrors({ ...errors, [questionId]: false });

    if (questionId === 'question3') {
      setChallengeCompleted(option);
    } else if (questionId === 'question4b') {
      if (option === 'Other') {
        setShowOtherSection(true);
      } else {
        setShowOtherSection(false);
      }
    } else if (questionId === 'question5a') {
      if (option === 'Other') {
        setShowOtherSection5a(true);
      } else {
        setShowOtherSection5a(false);
      }
    } else if (questionId === 'question5b') {
      if (option === 'Yes') {
        setShowEmailSection(true);
      } else {
        setShowEmailSection(false);
      }
    } else if (questionId === 'question6') {
      if (option === 'Yes') {
        setShowMediaSection(true);
      } else {
        // Only clear file if we're actually switching from "Yes" to "No"
        if (answers.question6 === 'Yes') {
          setSelectedFile(null);
          setShowCheckmark(false);
        }
        setShowMediaSection(false);
      }
    }
  };

  const declineResponse = () => {
    setCurrentQuestion(6);
  };

  const completeSurvey = () => {
    const timer = setTimeout(() => {
      try {
        setShowThankYou(true);
        const type = challengeCompleted === 'Yes' ? 'completed' : 'not-completed';
        setThankYouType(type);
        setLastThankYouType(type);
        setSurveyCompleted(true);
        localStorage.setItem('surveyCompleted', 'true');
        localStorage.setItem('lastThankYouType', type);
        navigate(`/thank-you/${type}`);
      } catch (error) {
        console.error('Error in completeSurvey:', error);
      }
    }, 600);
    
    // Cleanup function to prevent memory leaks
    return () => clearTimeout(timer);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('handleFileUpload called, file:', file);
    if (file) {
      // Basic file size validation (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      if (file.size > maxSize) {
        alert('File size is too large. Please select a file smaller than 10MB.');
        return;
      }
      
      // Set the file and show checkmark
      console.log('Setting selectedFile to:', file.name);
      setSelectedFile(file);
      console.log('Setting showCheckmark to true');
      setShowCheckmark(true);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setShowCheckmark(false);
  };

  const handleInputChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: false });
    }
  };

  if (showThankYou) {
    return (
      <div className="container">
        <div className="nav-bar">
          <div className="nav-links">
            <button className="nav-btn" onClick={goBackToMain}>Home</button>
            <button className="nav-btn" onClick={() => { setPreviousPage(thankYouType); setShowThankYou(false); setShowAbout(true); navigate('/about'); }}>About</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${updateProgress()}%` }}></div>
        </div>
        <div className="thank-you-page">
          {thankYouType === 'not-interested' && (
            <>
              <h2>Got it.</h2>
              <p>Be sure to keep up with our socials in case you change your mind!</p>
              <button className="not-interested-btn" onClick={goBackToMain} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                Go Back
              </button>
              <button className="not-interested-btn" onClick={() => { setPreviousPage('not-interested'); setShowThankYou(false); setShowAbout(true); navigate('/about'); }} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
          {thankYouType === 'completed' && (
            <>
              <h2>Submitted</h2>
              <p>Congratulations on Taking Step One</p>
              <p className="subheading">Keep up with our social media for more updates and to find out more about your next steps</p>
              <button className="about-btn" onClick={() => { setPreviousPage('completed'); setShowThankYou(false); setShowAbout(true); }} style={{ marginTop: '15px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <button className="not-interested-btn" onClick={resetSurvey} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                Take Survey Again (Reset)
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
          {thankYouType === 'not-completed' && (
            <>
              <h2>Submitted</h2>
              <p>Thanks for checking us out. Maybe next time.</p>
              <p className="subheading">Keep up with our socials in case you change your mind and to find out more about your next steps</p>
              <button className="about-btn" onClick={() => { setPreviousPage('not-completed'); setShowThankYou(false); setShowAbout(true); }} style={{ marginTop: '15px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <button className="not-interested-btn" onClick={resetSurvey} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                Take Survey Again (Reset)
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
          
          <div className="bottom-footer">
            <div className="copyright-footer">
              <span>© Step Zero, Inc 2025</span>
            </div>
            <div className="privacy-footer">
              <button className="privacy-link" onClick={() => { setPreviousPage(thankYouType); setShowThankYou(false); setShowPrivacy(true); navigate('/privacy'); }}>
                Privacy and Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPrivacy) {
    return (
      <div className="container">
        <div className="nav-bar">
          <div className="nav-links">
            <button className="nav-btn" onClick={goBackToMain}>Home</button>
            <button className="nav-btn" onClick={() => { setPreviousPage('privacy'); setShowPrivacy(false); setShowAbout(true); navigate('/about'); }}>About</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
          </div>
        </div>
        <div className="privacy-page">
          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                Privacy Policy
              </button>
              <button 
                className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
                onClick={() => setActiveTab('terms')}
              >
                Terms of Service
              </button>
              <button 
                className={`tab ${activeTab === 'cookies' ? 'active' : ''}`}
                onClick={() => setActiveTab('cookies')}
              >
                Cookies Policy
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'privacy' && (
                <div className="privacy-content">
                  <h2>Step Zero Privacy Policy</h2>
            <p className="privacy-date">Effective Date: 08/20/2025<br />Last Updated: 08/20/2025</p>
            
            <p>Step Zero ("we," "our," "us") respects your privacy. This Privacy Policy explains how we collect, use, and share information when you participate in Step Zero challenges or visit our website.</p>
            
            <h3>1. Information We Collect</h3>
            <p>When you engage with Step Zero, we may collect:</p>
            <ul>
                              <li><strong>Contact Information:</strong> such as your email address (if you choose to provide it).</li>
              <li><strong>Demographic Information:</strong> such as your age and gender (if you choose to provide it).</li>
              <li><strong>Survey Responses:</strong> written answers, reflections, and other personal responses about Step Zero challenges.</li>
              <li><strong>File Uploads:</strong> photos, videos, or documents you voluntarily submit.</li>
              <li><strong>Consent for Sharing:</strong> whether you allow us to share your responses or uploads on social media or other public channels.</li>
              <li><strong>Technical Data:</strong> limited technical information such as your browser type or IP address, collected automatically for security and analytics.</li>
            </ul>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Record and analyze participation in Step Zero challenges.</li>
              <li>Improve the design and impact of Step Zero.</li>
              <li>Communicate with you if you opted in to receive more challenges.</li>
                              <li>Share content publicly only if you gave explicit consent, while maintaining your anonymity.</li>
              <li>Maintain security and integrity of our website and services.</li>
            </ul>
            
            <h3>3. How We Share Your Information</h3>
            <p>We do not sell or rent your information.</p>
            <p>We may share:</p>
            <ul>
              <li><strong>With Consent and Always Anonymous:</strong> If you consent, we may share your responses or media (photos, videos, documents) on our social media channels, website, or other platforms. Any content shared publicly will be fully anonymized. We will remove or exclude names, email addresses, social media handles, and any other personally identifiable data. Viewers of shared content will not be able to connect the responses or media back to you.</li>
              <li><strong>Service Providers:</strong> third-party vendors that host our site, store data, or process form submissions (e.g., hosting platforms, analytics services).</li>
              <li><strong>Legal Compliance:</strong> if required by law, legal process, or to protect rights and safety.</li>
            </ul>
            
            <h3>4. Third-Party Services</h3>
            <p>We use the following third-party services to operate our website and store your data:</p>
            <ul>
              <li><strong>Vercel:</strong> We use Vercel for web hosting and content delivery. Vercel may collect technical information such as IP addresses and browser data as part of their hosting services.</li>
              <li><strong>Supabase:</strong> We use Supabase as our database and storage provider for securely storing your survey responses, file uploads, and other data you submit. Supabase processes and stores this data on our behalf.</li>
            </ul>
            <p>These services have their own privacy policies and data handling practices. We recommend reviewing their privacy policies to understand how they handle your data.</p>
            
            <h3>5. Data Retention</h3>
            <p>We retain information only as long as necessary to fulfill the purposes above. You may request deletion of your personal data at any time (see Section 9).</p>
            
            <h3>6. Your Rights</h3>
            <p>Depending on your location (e.g., California Consumer Privacy Act (CCPA) or EU/UK GDPR):</p>
            <ul>
              <li>You may request access to the data we hold about you.</li>
              <li>You may request corrections or deletion.</li>
              <li>You may opt out of further communications.</li>
              <li>You may withdraw consent for sharing at any time.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:stepzeroglobal@gmail.com">stepzeroglobal@gmail.com</a></p>
            
            <h3>7. Security</h3>
            <p>We use reasonable measures to protect your information, but no system is 100% secure. Please only submit content you are comfortable sharing.</p>
            
            <h3>8. Children's Privacy</h3>
            <p>Step Zero is not directed at children under 13. We do not knowingly collect personal data from children under 13 without parental consent.</p>
            
            <h3>9. Contact Us</h3>
            <p>If you have questions or requests regarding this Privacy Policy, please contact us at:</p>
            <p>Email: <a href="mailto:stepzeroglobal@gmail.com">stepzeroglobal@gmail.com</a></p>
            
            <h3>10. Updates</h3>
            <p>We may update this Privacy Policy from time to time. Changes will be posted with a revised "Effective Date."</p>
                </div>
              )}
              
              {activeTab === 'terms' && (
                <div className="terms-content">
                  <h2>Step Zero Terms of Service</h2>
                  <p className="privacy-date">Effective Date: 08/20/2025<br />Last Updated: 08/20/2025</p>
                  
                  <p>Welcome to Step Zero ("we," "our," "us"). By using our website, submitting responses, or participating in Step Zero challenges, you agree to these Terms of Service ("Terms"). Please read them carefully.</p>
                  
                  <h3>1. Acceptable Use</h3>
                  <p>You agree to use Step Zero only for lawful purposes. You must not:</p>
                  <ul>
                    <li>Submit any unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable material.</li>
                    <li>Upload files that you do not have the rights to share.</li>
                    <li>Attempt to interfere with or disrupt the website's operation or security.</li>
                    <li>Use automated tools (bots, scripts) to access, copy, or alter content without authorization.</li>
                  </ul>
                  <p>We may suspend or terminate your access if we reasonably believe you have violated these Terms.</p>
                  
                  <h3>2. Content Ownership and Licensing</h3>
                  <p><strong>Your Content:</strong> You retain ownership of the responses, reflections, photos, videos, or other media ("Content") you submit.</p>
                  <p><strong>License You Grant Us:</strong> By submitting Content, you grant Step Zero a non-exclusive, worldwide, royalty-free license to use and display your Content only for the purposes you consented to (for example: internal research, anonymized analysis, or sharing anonymized excerpts online).</p>
                  <p><strong>Anonymity:</strong> If you consent to public sharing, your Content will be shared anonymously. Personally identifiable data (such as name, email, social handle) will not be attached.</p>
                  
                  <h3>3. Limitation of Liability</h3>
                  <p>To the fullest extent permitted by law:</p>
                  <ul>
                    <li>Step Zero is not liable for any damages, losses, or liabilities arising from your use of the site or participation in challenges.</li>
                    <li>All challenges are voluntary. You are responsible for your own safety and well-being when completing any activity.</li>
                    <li>We provide the website and challenges "as is" without warranties of any kind, either express or implied.</li>
                  </ul>
                  
                  <h3>4. Third-Party Providers</h3>
                  <p>We may rely on third-party providers to operate the site. By using Step Zero, you acknowledge this reliance and understand that our service may be subject to the availability and performance of these third-party services.</p>
                  
                  <h3>5. Dispute Resolution</h3>
                  <ul>
                    <li>If you have a dispute with Step Zero, we encourage you to contact us first at stepzeroglobal@gmail.com to attempt to resolve it informally.</li>
                    <li>If unresolved, disputes will be handled through binding arbitration under the rules of the American Arbitration Association, unless otherwise required by law.</li>
                    <li>Any claims must be brought individually, and not as part of a class action.</li>
                    <li>These Terms are governed by the laws of the State of Florida, without regard to conflict of law principles.</li>
                  </ul>
                  
                  <h3>6. Termination</h3>
                  <p>We may suspend or terminate your access to Step Zero at any time, without notice, if we reasonably believe you have violated these Terms or engaged in unlawful or harmful activity. You may also stop using Step Zero at any time.</p>
                  
                  <h3>7. Changes to Terms</h3>
                  <p>We may update these Terms from time to time. Changes will be posted with a new "Last Updated" date. Continued use of the site after changes means you accept the revised Terms.</p>
                  
                  <h3>8. Contact Us</h3>
                  <p>For questions about these Terms, please contact us at:</p>
                  <p>Email: <a href="mailto:stepzeroglobal@gmail.com">stepzeroglobal@gmail.com</a></p>
                </div>
              )}
              
              {activeTab === 'cookies' && (
                <div className="cookies-content">
                  <h2>Step Zero Cookies Policy</h2>
                  <p className="privacy-date">Effective Date: 08/20/2025<br />Last Updated: 08/20/2025</p>
                  
                  <p>This Cookies Policy explains how Step Zero ("we," "our," "us") uses cookies and similar technologies on our website.</p>
                  
                  <h3>1. What Are Cookies?</h3>
                  <p>Cookies are small text files placed on your device when you visit a website. They help websites function properly, remember preferences, and improve user experience. Similar technologies (such as pixels, tags, and local storage) may also be used and are treated as "cookies" for the purposes of this policy.</p>
                  
                  <h3>2. Types of Cookies We Use</h3>
                  <p><strong>Strictly Necessary Cookies</strong><br />
                  Required for the website to work. These include things like remembering if you accepted our Terms or Privacy Policy. You cannot disable these cookies.</p>
                  
                  <p><strong>Performance and Analytics Cookies</strong><br />
                  Help us understand how people use Step Zero (e.g., which pages are most visited). This information is used only in aggregate and helps us improve the site.</p>
                  
                  <p><strong>Functional Cookies</strong><br />
                  Allow us to remember your preferences (e.g., if you opted in to receive more challenges).</p>
                  
                  <p><strong>Consent Cookies</strong><br />
                  Used to remember whether you consented to share responses or uploads.</p>
                  
                  <p>We do not use cookies for advertising or marketing.</p>
                  
                  <h3>3. Why We Use Cookies</h3>
                  <p>We use cookies to:</p>
                  <ul>
                    <li>Ensure the site functions correctly.</li>
                    <li>Track participation in surveys and challenges.</li>
                    <li>Improve usability and site performance.</li>
                    <li>Securely store consent preferences.</li>
                  </ul>
                  
                  <h3>4. Third-Party Cookies</h3>
                  <p>Some cookies may be set by third-party service providers we use to:</p>
                  <ul>
                    <li>Host the website.</li>
                    <li>Collect analytics data (e.g., Google Analytics, if enabled).</li>
                  </ul>
                  <p>These third parties may collect information directly from your browser as governed by their own privacy policies.</p>
                  
                  <h3>5. How You Can Control Cookies</h3>
                  <p><strong>Browser Settings:</strong> Most web browsers let you control cookies through settings. You can usually block or delete cookies at any time.</p>
                  <p><strong>Opt-Out Tools:</strong> If we use Google Analytics, you can opt out by installing the Google Analytics opt-out browser add-on.</p>
                  <p><strong>Consent Banner:</strong> When you first visit Step Zero, you may see a banner asking you to accept or manage cookies. Your preferences will be saved in a consent cookie.</p>
                  <p>Please note: Disabling certain cookies may affect how the website functions.</p>
                  
                  <h3>6. Updates to This Cookies Policy</h3>
                  <p>We may update this Cookies Policy from time to time. Any changes will be posted here with a new "Last Updated" date.</p>
                  
                  <h3>7. Contact Us</h3>
                  <p>If you have any questions about this Cookies Policy, please contact us at:</p>
                  <p>Email: <a href="mailto:stepzeroglobal@gmail.com">stepzeroglobal@gmail.com</a></p>
                </div>
              )}
            </div>
          </div>
          
          <button className="continue-btn" style={{ transform: 'scale(0.75)' }} onClick={() => {
            setShowPrivacy(false);
            if (previousPage === 'survey') {
              setShowSurvey(true);
            } else if (previousPage === 'not-interested') {
              setShowThankYou(true);
              setThankYouType('not-interested');
            } else if (previousPage === 'completed') {
              setShowThankYou(true);
              setThankYouType('completed');
            } else if (previousPage === 'not-completed') {
              setShowThankYou(true);
              setThankYouType('not-completed');
            } else if (previousPage === 'about') {
              setShowAbout(true);
            }
          }}>
            Back
          </button>
          <div className="social-links">
            <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <div className="copyright-footer">
            <span>© Step Zero, Inc 2025</span>
          </div>
        </div>
      </div>
    );
  }

  if (showAbout) {
    return (
      <div className="container">
        <div className="nav-bar">
          <div className="nav-links">
            <button className="nav-btn" onClick={goBackToMain}>Home</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>About</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
          </div>
        </div>
        <div className="about-page">
                        <h2>About Us</h2>
          <div className="about-content">
            <p>
              Step Zero is a movement created to push people to become the best version of themselves 
              by confronting them with challenges that they may naturally avoid, delay or not think about altogether. We believe 
              that meaningful growth only happens outside of your comfort zone.
            </p>
            <p>
              Our challenges are designed to push you beyond your limits, helping you discover strength 
              and resilience you never knew you had. Each card represents a small step toward personal transformation.
            </p>
            <p>
              By completing the challenge, you take the first step toward becoming the best version of yourself. 
              That's what Step Zero is all about.
            </p>
            <div className="about-features">
              <div className="feature">
                <h4>Avoid Comfort</h4>
                <p>Goals are not achieved in the comfort zone. Challenge yourself to grow.</p>
              </div>
              <div className="feature">
                <h4>Break Through</h4>
                <p>Resistance is your signal to go harder. Research shows that discomfort is misinterpreted as a warning to stop, in reality, it's a sign to keep going.</p>
              </div>
              <div className="feature">
                <h4>This is Step Zero</h4>
                <p>You decide if you want to continue walking.</p>
              </div>
            </div>
          </div>
          <button className="continue-btn" style={{ transform: 'scale(0.75)' }} onClick={() => {
            setShowAbout(false);
            if (previousPage === 'hero') {
              // Return to hero page
              navigate('/');
            } else if (previousPage === 'privacy') {
              setShowPrivacy(true);
            } else if (previousPage === 'not-interested') {
              setShowThankYou(true);
              setThankYouType('not-interested');
              navigate('/thank-you/not-interested');
            } else if (previousPage === 'completed') {
              setShowThankYou(true);
              setThankYouType('completed');
              navigate('/thank-you/completed');
            } else if (previousPage === 'not-completed') {
              setShowThankYou(true);
              setThankYouType('not-completed');
              navigate('/thank-you/not-completed');
            }
          }}>
            Back
          </button>
          
          <div className="bottom-footer">
            <div className="copyright-footer">
              <span>© Step Zero, Inc 2025</span>
            </div>
            <div className="social-footer">
              <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <div className="privacy-footer">
              <button className="privacy-link" onClick={() => { setPreviousPage('about'); setShowAbout(false); setShowPrivacy(true); navigate('/privacy'); }}>
                Privacy and Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="container">
      {!showSurvey && (
        <>
          <div className="nav-bar">
            <div className="nav-links">
              <button className="nav-btn" onClick={goBackToMain}>Home</button>
              <button className="nav-btn" onClick={() => { setPreviousPage('hero'); setShowAbout(true); }}>About</button>
              <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
            </div>
          </div>
          <div className="hero">
            <h1 className="main-header">This is Step Zero</h1>
            <p className="sub-header">Become the Best Version of Yourself<br />Whether you Like it or Not</p>
            <button className="continue-btn" onClick={startSurvey}>Continue</button>
            <button className="not-interested-btn hero-not-interested" onClick={showNotInterested}>Not Interested</button>
          </div>
          
          <div className="bottom-footer">
            <div className="copyright-footer">
              <span>© Step Zero, Inc 2025</span>
            </div>
            <div className="social-footer">
              <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <div className="privacy-footer">
              <button className="privacy-link" onClick={() => { setPreviousPage('hero'); setShowPrivacy(true); }}>
                Privacy and Terms
              </button>
            </div>
          </div>
          
          {/* Cookie Banner Popup */}
          {showCookieBanner && (
            <div className="cookie-banner-popup">
              <div className="cookie-popup-content">
                <h4>We Use Cookies</h4>
                <p>
                  We use cookies to enhance your experience and analyze site usage. 
                  By continuing to use our site, you consent to our use of cookies.
                </p>
                <div className="cookie-popup-buttons">
                  <button className="cookie-popup-btn accept" onClick={acceptCookies}>
                    Accept All
                  </button>
                  <button className="cookie-popup-btn necessary" onClick={acceptNecessaryCookies}>
                    Necessary Only
                  </button>
                  <button className="cookie-popup-btn decline" onClick={declineCookies}>
                    Decline All
                  </button>
                </div>
                <button 
                  className="cookie-popup-link"
                  onClick={() => { setShowCookieBanner(false); setShowPrivacy(true); setActiveTab('cookies'); navigate('/privacy'); }}
                >
                  Learn more
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showSurvey && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${updateProgress()}%` }}></div>
          </div>

          <div className="survey">
            {showChallengeIntro && currentQuestion === 0 && !showThankYou && (
              <div className="question challenge-intro">
                <h3>Tell us about your challenge</h3>
              </div>
            )}

          {currentQuestion === 1 && (
            <div className="question">
              <h3>What did your card say?</h3>
              <div className="text-input-container">
                <textarea
                  className={`text-input ${errors.answer1 ? 'shake' : ''}`}
                  placeholder="Enter the challenge written on your card..."
                  value={answers.answer1 || ''}
                  onChange={(e) => handleInputChange('answer1', e.target.value)}
                  rows="4"
                  key={`answer1-${shakeTrigger}`}
                />
                <div className="button-container">
                  <button className="back-btn small" onClick={goBack}>
                    Back
                  </button>
                  <button className="continue-btn small" onClick={() => validateAndContinue(1)}>
                    Continue
                  </button>
                </div>
                {errors.answer1 && <div className="error-message">Please provide a response</div>}
              </div>
            </div>
          )}

          {currentQuestion === 2 && (
            <div className="question">
              <h3>Where did you find your card?</h3>
              <div className="text-input-container">
                <textarea
                  className={`text-input ${errors.answer2 ? 'shake' : ''}`}
                  placeholder="Enter the location where you found your card..."
                  value={answers.answer2 || ''}
                  onChange={(e) => handleInputChange('answer2', e.target.value)}
                  rows="4"
                  key={`answer2-${shakeTrigger}`}
                />
                <div className="button-container">
                  <button className="back-btn small" onClick={goBack}>
                    Back
                  </button>
                  <button className="continue-btn small" onClick={() => validateAndContinue(2)}>
                    Continue
                  </button>
                </div>
                {errors.answer2 && <div className="error-message">Please provide a response</div>}
              </div>
            </div>
          )}

          {currentQuestion === 3 && (
            <div className="question">
              <h3>Did you complete your challenge?</h3>
              <div className="options-container">
                <div className={`options ${errors.question3 ? 'shake' : ''}`} key={`question3-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question3 === 'Yes' ? 'selected' : ''}`}
                    onClick={() => selectOption('question3', 'Yes')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Yes</div>
                  </div>
                  <div 
                    className={`option ${answers.question3 === 'Not Yet' ? 'selected' : ''}`}
                    onClick={() => selectOption('question3', 'Not Yet')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Not Yet</div>
                  </div>
                </div>
                {errors.question3 && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(3)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentQuestion === '4a' && (
            <div className="question">
              <h3>Describe your level of discomfort while completing your challenge</h3>
              <div className="options-container">
                <div className={`options ${errors.question4a ? 'shake' : ''}`} key={`question4a-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question4a === 'Too Comfortable' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4a', 'Too Comfortable')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Too Comfortable</div>
                  </div>
                  <div 
                    className={`option ${answers.question4a === 'Comfortable' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4a', 'Comfortable')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Comfortable</div>
                  </div>
                  <div 
                    className={`option ${answers.question4a === 'Neutral' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4a', 'Neutral')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Neutral</div>
                  </div>
                  <div 
                    className={`option ${answers.question4a === 'Uncomfortable' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4a', 'Uncomfortable')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Uncomfortable</div>
                  </div>
                  <div 
                    className={`option ${answers.question4a === 'Really Uncomfortable' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4a', 'Really Uncomfortable')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Really Uncomfortable</div>
                  </div>
                </div>
                {errors.question4a && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(4, 'a')}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentQuestion === '4b' && (
            <div className="question">
              <h3>Why not?</h3>
              <div className="options-container">
                <div className={`options ${errors.question4b ? 'shake' : ''}`} key={`question4b-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question4b === 'No Time' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'No Time')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">No Time</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'Nervous' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'Nervous')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Nervous</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'Not Interested' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'Not Interested')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Not Interested</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'Other' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'Other')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Other</div>
                  </div>
                </div>
                {errors.question4b && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(4, 'b')}>
                  Continue
                </button>
              </div>
              
              {showOtherSection && (
                <div className="other-section">
                  <div className="text-input-container">
                    <textarea
                      className={`text-input ${errors['answer4b-other'] ? 'shake' : ''}`}
                      placeholder="Other..."
                      value={answers['answer4b-other'] || ''}
                      onChange={(e) => handleInputChange('answer4b-other', e.target.value)}
                      rows="4"
                      key={`answer4b-other-${shakeTrigger}`}
                    />
                    {errors['answer4b-other'] && <div className="error-message">Please provide a response</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion === '5a' && (
            <div className="question">
              <h3>What made you decide to do it?</h3>
              <div className="options-container">
                <div className={`options ${errors.question5a ? 'shake' : ''}`} key={`question5a-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question5a === 'I was just curious' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5a', 'I was just curious')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I was just curious</div>
                  </div>
                  <div 
                    className={`option ${answers.question5a === 'It was already a part of my routine' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5a', 'It was already a part of my routine')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">It was already a part of my routine</div>
                  </div>
                  <div 
                    className={`option ${answers.question5a === 'It required minimal effort' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5a', 'It required minimal effort')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">It required minimal effort</div>
                  </div>
                  <div 
                    className={`option ${answers.question5a === 'I wanted to push myself' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5a', 'I wanted to push myself')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I wanted to push myself</div>
                  </div>
                  <div 
                    className={`option ${answers.question5a === 'Other' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5a', 'Other')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Other</div>
                  </div>
                </div>
                {errors.question5a && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(5, 'a')}>
                  Continue
                </button>
              </div>
              
              {showOtherSection5a && (
                <div className="other-section">
                  <div className="text-input-container">
                    <textarea
                      className={`text-input ${errors['answer5a-other'] ? 'shake' : ''}`}
                      placeholder="Other..."
                      value={answers['answer5a-other'] || ''}
                      onChange={(e) => handleInputChange('answer5a-other', e.target.value)}
                      rows="4"
                      key={`answer5a-other-${shakeTrigger}`}
                    />
                    {errors['answer5a-other'] && <div className="error-message">Please provide a response</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion === '5c' && (
            <div className="question">
              <h3>Would you do another similar challenge tomorrow?</h3>
              <div className="options-container">
                <div className={`options ${errors.question5c ? 'shake' : ''}`} key={`question5c-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question5c === 'Yes' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5c', 'Yes')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Yes</div>
                  </div>
                  <div 
                    className={`option ${answers.question5c === 'No' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5c', 'No')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">No</div>
                  </div>
                </div>
                {errors.question5c && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(5, 'c')}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentQuestion === '5b' && (
            <div className="question">
              <h3>Would you like to be reminded of Step Zero?</h3>
              <div className="options-container">
                <div className={`options ${errors.question5b ? 'shake' : ''}`} key={`question5b-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question5b === 'Yes' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5b', 'Yes')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Yes</div>
                  </div>
                  <div 
                    className={`option ${answers.question5b === 'No' ? 'selected' : ''}`}
                    onClick={() => selectOption('question5b', 'No')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">No</div>
                  </div>
                </div>
                {errors.question5b && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(5, 'b')}>
                  Continue
                </button>
              </div>
              
              {showEmailSection && (
                <div className="email-section">
                  <div className="text-input-container">
                    <input
                      type="email"
                      className={`text-input ${errors['answer5b-email'] ? 'shake' : ''}`}
                      placeholder="name@domain.com"
                      value={answers['answer5b-email'] || ''}
                      onChange={(e) => handleInputChange('answer5b-email', e.target.value)}
                      key={`answer5b-email-${shakeTrigger}`}
                    />
                    {errors['answer5b-email'] && <div className="error-message">Please provide a valid email address</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion === 7 && (
            <div className="question">
              <h3>Age</h3>
              <div className="text-input-container">
                <div className="age-input-container">
                  <input
                    type="number"
                    className={`text-input ${errors.age ? 'shake' : ''}`}
                    placeholder="Enter your age"
                    value={answers.age || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers and limit to 3 digits
                      if (value === '' || (/^\d{1,3}$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 120)) {
                        handleInputChange('age', value);
                      }
                    }}
                    min="1"
                    max="120"
                    key={`age-${shakeTrigger}`}
                  />

                </div>
                <div className="button-container">
                  <button className="back-btn small" onClick={goBack}>
                    Back
                  </button>
                  <button className="continue-btn small" onClick={() => validateAndContinue(7)}>
                    Continue
                  </button>
                </div>
                {errors.age && <div className="error-message">Please provide a valid age</div>}
              </div>
            </div>
          )}

          {currentQuestion === 8 && (
            <div className="question">
              <h3>Gender</h3>
              <div className="text-input-container">
                <select
                  className={`text-input ${errors.gender ? 'shake' : ''}`}
                  value={answers.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  key={`gender-${shakeTrigger}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <div className="error-message">Please provide a response</div>}
              </div>
              
              <div className="consent-section">
                <div className={`consent-checkbox ${errors.consent ? 'shake' : ''}`} key={`consent-${shakeTrigger}`}>
                  <input
                    type="checkbox"
                    id="terms-consent"
                    checked={termsConsent}
                    onChange={(e) => setTermsConsent(e.target.checked)}
                  />
                  <label htmlFor="terms-consent">
                    I acknowledge that I have read and agree to the{' '}
                    <button 
                      type="button" 
                      className="inline-link"
                      onClick={() => { setPreviousPage('survey'); setShowPrivacy(true); }}
                    >
                      Privacy Policy
                    </button>
                    {' '}and{' '}
                    <button 
                      type="button" 
                      className="inline-link"
                      onClick={() => { setPreviousPage('survey'); setShowPrivacy(true); setActiveTab('terms'); }}
                    >
                      Terms of Service
                    </button>
                    . I consent to the collection, use, and processing of my data as described therein.
                  </label>
                </div>
                {errors.consent && <div className="error-message">You must acknowledge and agree to the Privacy Policy and Terms of Service to continue</div>}
              </div>
              
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(8)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentQuestion === 6 && (
            <div className="question">
              <h3>Do you consent to having your response anonymously shared online?</h3>
              <div className="options-container">
                <div className={`options ${errors.question6 ? 'shake' : ''}`} key={`question6-${shakeTrigger}`}>
                  <div 
                    className={`option ${answers.question6 === 'Yes' ? 'selected' : ''}`}
                    onClick={() => selectOption('question6', 'Yes')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">Yes</div>
                  </div>
                  <div 
                    className={`option ${answers.question6 === 'No' ? 'selected' : ''}`}
                    onClick={() => selectOption('question6', 'No')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">No</div>
                  </div>
                </div>
                {errors.question6 && <div className="error-message">Please choose a response</div>}
              </div>
              <div className="button-container">
                <button className="back-btn small" onClick={goBack}>
                  Back
                </button>
                <button className="continue-btn small" onClick={() => validateAndContinue(6)}>
                  Continue
                </button>
              </div>
              
              {showMediaSection && (
                <div className="media-section">
                  <h4>Photo/Video Attachment (optional):</h4>
                  <div className="upload-container">
                    <input
                      type="file"
                      id="media-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt,.mp4,.mov,.avi,.wmv,.flv,.webm,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <button className="upload-btn" onClick={() => document.getElementById('media-upload').click()}>
                      Choose File
                    </button>
                    {selectedFile && (
                      <div className="file-info">
                        <span className="file-name">{selectedFile.name}</span>
                        <button className="remove-file" onClick={removeFile}>Remove</button>
                        {showCheckmark && <span className="upload-checkmark">✓</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          <div className="bottom-footer">
            <div className="copyright-footer">
              <span>© Step Zero, Inc 2025</span>
            </div>
            <div className="social-footer">
              <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <div className="privacy-footer">
              <button className="privacy-link" onClick={() => { setPreviousPage('hero'); setShowPrivacy(true); }}>
                Privacy and Terms
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/about" element={<AppContent />} />
        <Route path="/privacy" element={<AppContent />} />
        <Route path="/thank-you/:type" element={<AppContent />} />
        <Route path="/survey/intro" element={<AppContent />} />
        <Route path="/survey/question/:questionNum" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
