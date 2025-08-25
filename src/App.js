import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { supabase } from './supabase';
import emailjs from '@emailjs/browser';
import './App.css';

function AppContent() {
  // Add error boundary
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: 'white', 
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Something went wrong</h2>
        <p>Please refresh the page or try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const timerRef = useRef(null);
  const submittedTimerRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [showChallengeAssignment, setShowChallengeAssignment] = useState(false);
  const [showChallengeText, setShowChallengeText] = useState(false);
  const [challengeFadeIn, setChallengeFadeIn] = useState(false);
  const [challengeAssignmentTimer, setChallengeAssignmentTimer] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [assignedChallenge, setAssignedChallenge] = useState('');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalQuestionSubmitted, setFinalQuestionSubmitted] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [surveyHidden, setSurveyHidden] = useState(false);

  const homeBtnRef = useRef(null);
  const aboutBtnRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const totalQuestions = 9;

  // Challenge data structure
  const challengeSets = {
    'Beach/Park': [
      'Sit and take in nature and the sounds around you for 15 minutes, without checking your phone',
      'Pay a stranger a genuine compliment',
      'Throw away a couple pieces of trash, even if they\'re not yours',
      'Strike up a meaningful conversation with someone who is clearly outside your demographic',
      'Exist without distractions for 30 minutes, no phone, no music, just observe your environment or enjoy nature',
      'Give up your personal comfort: pick up a piece of trash, give up your seat, help someone who looks like they can use it.',
      'Hold the door for 3 different people today'
    ],
    'Coffee Shop/Library': [
      'Create a mini plan today for a goal you\'ve been delaying',
      'Start a conversation with a stranger, ask them how their day is going',
      'Journal when you get home today',
      'Take a cold shower today',
      'Do not complain about anything for the whole day tomorrow',
      'Stay off of all social media for the rest of today',
      'Stay off your phone until you finish one of your tasks that you came here to complete',
      'Start working on a business idea you\'ve had, or try to come up with one to start working on',
      'Physically write out your plan towards a goal of yours',
      'Draw out an idea that you\'ve had recently for a product or service',
      'Set a new goal for yourself',
      'Make plans for how you will achieve your current goals'
    ],
    'Fitness Class (Yoga, HIIT, Spin, Pilates)': [
      'Sit still for 5 minutes after class with your eyes closed and take a moment for yourself',
      'Hold your hardest pose 10 seconds longer than you want to',
      'Ask your instructor what they think you should focus on most',
      'Take 10 minutes after class to practice your hardest pose',
      'Compliment someone in class on their practice',
      'Set a new goal for your practice',
      'Plan out how you should achieve your current goals for your practice',
      'Attend a class that you are intimidated by or generally avoid'
    ],
    'Martial Arts Gym': [
      'Stay after class and drill what you learned today',
      'Roll with at least two higher belts today',
      'Show up to the next class 15 minutes early',
      'Thank all of your coaches after class today',
      'Ask your trainers what you can be doing better with your technique',
      'Ask to roll with your coach',
      'Commit to a goal in your training and write down the steps you\'ll take to reach it'
    ],
    'Movies/Mall/Bowling/Arcade/Theme Park': [
      'Sit and take in nature and the sounds around you for 15 minutes, without checking your phone',
      'Pay a stranger a genuine compliment',
      'Throw away a couple pieces of trash, even if they\'re not yours',
      'Strike up a meaningful conversation with someone who is clearly outside your demographic',
      'Exist without distractions for 30 minutes, no phone, no music, just observe your environment or enjoy nature',
      'Give up your personal comfort: pick up a piece of trash, give up your seat, help someone who looks like they can use it.',
      'Hold the door for 3 different people today'
    ],
    'Office': [
      'Do the hardest task on your list first thing today',
      'Turn off your notifications for 1 hour and do deep work',
      'Thank someone for their help this week, in person',
      'Plan tomorrow\'s 3 \'must-do\' tasks before leaving the office today',
      'Avoid drinking coffee today',
      'Write down 1 way that you can improve in the office and what you can do to implement it'
    ],
    'Weightlifting Gym': [
      'Spend 10 minutes stretching after your workout',
      'Take a cold shower today',
      'Avoid looking at your phone this workout',
      'Complete an extra set on each workout today',
      'Do 10 minutes on the stair master before or after your workout today',
      'Do a 10 minute light jog on the treadmill before or after your workout',
      'Rep your next exercise until failure, real failure',
      'Commit to a goal in the gym and write down steps you\'ll take to achieve it',
      'Workout with no music today'
    ]
  };

  // Helper function to get random challenge
  const getRandomChallenge = (location) => {
    const challenges = challengeSets[location];
    if (!challenges) return '';
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  // EmailJS configuration
  const EMAILJS_PUBLIC_KEY = 'ilfTXIUCME6n3-XCC';
  const EMAILJS_SERVICE_ID = 'service_dj40m4g';
  const EMAILJS_TEMPLATE_ID = 'template_nev3k64';

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      // Don't show indicator on thank you pages
      if (showThankYou) {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 });
        return;
      }
      
      const target = showAbout ? aboutBtnRef.current : homeBtnRef.current;
      if (target) {
        const { offsetLeft, offsetWidth } = target;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [showAbout, showThankYou, showPrivacy, showSurvey]);

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
    try {
      const savedCookieConsent = localStorage.getItem('cookiesAccepted');
      const savedSurveyCompleted = localStorage.getItem('surveyCompleted');
      const savedLastThankYouType = localStorage.getItem('lastThankYouType');
      
      // Check for saved survey progress
      const savedLocation = localStorage.getItem('stepZeroLocation');
      const savedChallenge = localStorage.getItem('stepZeroChallenge');
      const savedAnswers = localStorage.getItem('stepZeroAnswers');
      const savedCurrentQuestion = localStorage.getItem('stepZeroCurrentQuestion');
      
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

      // Restore survey progress if exists
      if (savedLocation && savedChallenge) {
        setSelectedLocation(savedLocation);
        setAssignedChallenge(savedChallenge);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
        if (savedCurrentQuestion) {
          setCurrentQuestion(parseInt(savedCurrentQuestion));
        }
        // Show challenge assignment screen if user was in progress
        if (savedCurrentQuestion && parseInt(savedCurrentQuestion) === 0) {
          setShowSurvey(true);
          setShowChallengeAssignment(true);
          setChallengeFadeIn(true);
        }
      }
    } catch (error) {
      console.error('Error in initial useEffect:', error);
      setHasError(true);
    }
  }, [navigate]);

  // Cleanup submitted timer on unmount
  useEffect(() => {
    return () => {
      if (submittedTimerRef.current) {
        clearTimeout(submittedTimerRef.current);
      }
      if (challengeAssignmentTimer) {
        clearTimeout(challengeAssignmentTimer);
      }
    };
  }, [challengeAssignmentTimer]);

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
      setShowLocationSelection(false);
      setShowChallengeAssignment(false);
      setSelectedLocation('');
      setAssignedChallenge('');
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
      setShowLocationSelection(false);
      setShowChallengeAssignment(false);
      setSelectedLocation('');
      setAssignedChallenge('');
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
      setShowLocationSelection(false);
      setShowChallengeAssignment(false);
      setSelectedLocation('');
      setAssignedChallenge('');
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
      setShowLocationSelection(false);
      setShowChallengeAssignment(false);
      setSelectedLocation('');
      setAssignedChallenge('');
      setChallengeCompleted(null);
      setAnswers({});
      setShowOtherSection(false);
      setShowOtherSection5a(false);
      setShowEmailSection(false);
      setShowMediaSection(false);
      setSelectedFile(null);
      setShowCheckmark(false);
      setErrors({});
    }
    // Note: We don't handle /survey/question/* routes here to avoid interfering with survey flow
  }, [location.pathname]);





  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);



  const startSurvey = () => {
    // Reset final question submitted state
    setFinalQuestionSubmitted(false);
    
    // Check if survey was completed and if enough time has passed (1 minute)
    const surveyCompletionTime = localStorage.getItem('surveyCompletionTime');
    const currentTime = Date.now();
    const oneMinute = 60 * 1000; // 60 seconds in milliseconds
    
    if (surveyCompleted && surveyCompletionTime && (currentTime - parseInt(surveyCompletionTime)) < oneMinute) {
      // If survey was completed less than 1 minute ago, show the appropriate thank you page
      // But only if it wasn't completed via "Not Interested" - in that case, start fresh
      if (lastThankYouType && lastThankYouType !== 'not-interested') {
        setShowThankYou(true);
        setThankYouType(lastThankYouType);
        navigate(`/thank-you/${lastThankYouType}`);
        return;
      }
    }
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setShowSurvey(true);
    setShowLocationSelection(true);
    setShowChallengeAssignment(false);
    setSelectedLocation('');
    setAssignedChallenge('');
    setSurveyHidden(false);
  };

  const showNotInterested = () => {
    if (showChallengeText) {
      setPreviousPage('challenge');
    } else {
      setPreviousPage('hero');
    }

    setShowChallengeText(false);
    setShowSurvey(false);
    setShowThankYou(true);
    setThankYouType('not-interested');
    setLastThankYouType('not-interested');
    setSurveyCompleted(true);
    localStorage.setItem('surveyCompleted', 'true');
    localStorage.setItem('lastThankYouType', 'not-interested');
    localStorage.setItem('surveyCompletionTime', Date.now().toString());
    navigate('/thank-you/not-interested');
  };

  const handleNotInterestedBack = () => {
    if (previousPage === 'challenge') {
      setShowThankYou(false);
      setShowSurvey(true);
      setShowChallengeText(true);
      setPreviousPage('');
      navigate('/survey/location');
    } else {
      goBackToMain();
    }
  };

  const goBackToMain = () => {
    setShowSurvey(false);
    setShowThankYou(false);
    setShowAbout(false);
    setShowPrivacy(false);
    setThankYouType('');
    setCurrentQuestion(0);
    setShowLocationSelection(false);
    setShowChallengeAssignment(false);
    setSelectedLocation('');
    setAssignedChallenge('');
    setChallengeCompleted(null);
    setAnswers({});
    setShowOtherSection(false);
    setShowOtherSection5a(false);
    setShowEmailSection(false);
    setShowMediaSection(false);
    setSelectedFile(null);
    setShowCheckmark(false);
    setErrors({});
    
    // Clear saved progress
    localStorage.removeItem('stepZeroLocation');
    localStorage.removeItem('stepZeroChallenge');
    localStorage.removeItem('stepZeroAnswers');
    localStorage.removeItem('stepZeroCurrentQuestion');
    
    navigate('/');
  };



  const goBack = () => {
    if (currentQuestion === 1) {
      setShowChallengeAssignment(true);
      setChallengeFadeIn(true);
      setCurrentQuestion(0);
      navigate('/survey/location');
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
      setFinalQuestionSubmitted(false);
      setIsSubmitting(false);
      navigate('/survey/question/7');
    }
  };

  const updateProgress = () => {
    const totalSteps = 10;
    let step = 0;

    if (showThankYou && thankYouType !== 'not-interested') step = totalSteps;
    else if (showLocationSelection) step = 1;
    else if (showChallengeAssignment) step = 2;
    else if (showChallengeText) step = 3;
    else if (currentQuestion === 1) step = 4;
    else if (currentQuestion === 3) step = 5;
    else if (
      currentQuestion === '4a' ||
      currentQuestion === '4b' ||
      currentQuestion === '4b-other'
    )
      step = 6;
    else if (
      currentQuestion === '5a' ||
      currentQuestion === '5c' ||
      currentQuestion === '5b' ||
      currentQuestion === '5b-email'
    )
      step = 7;
    else if (currentQuestion === 6) step = 8;
    else if (currentQuestion === 7) step = 9;
    else if (currentQuestion === 8) step = 10;

    return (step / totalSteps) * 100;
  };

  const validateAndContinue = (questionNumber, suffix = '') => {
    console.log('validateAndContinue called with:', { questionNumber, suffix, finalQuestionSubmitted, isSubmitting });
    // Only prevent submission on the final question (question 8)
    if (questionNumber === 8 && finalQuestionSubmitted) {
      console.log('Returning early due to finalQuestionSubmitted');
      return;
    }
    
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

    if (questionNumber === 1) {
      isValid = answers.question3 !== undefined;
    } else if (questionNumber === 2) {
      const answer = answers[`answer${questionId}`] || '';
      if (answer === 'Other') {
        const otherAnswer = answers['answer2-other'] || '';
        isValid = otherAnswer.trim().length > 0;
        errorKey = 'answer2-other';
      } else {
        isValid = answer.trim().length > 0;
      }
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
        
        if (answer.trim().length === 0) {
          isValid = false;
          errorKey = 'answer5b-email-empty';
        } else if (!emailRegex.test(answer)) {
          isValid = false;
          errorKey = 'answer5b-email-invalid';
        } else {
          isValid = true;
        }
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
      console.log('Question 8 validation:', { gender, hasGender, hasConsent, isValid, errorKey });
    }

    if (isValid) {
      console.log('Validation passed, proceeding with navigation');
      // Clear email-specific errors when validation passes
      if (questionId === '5b') {
        setErrors({ 
          ...errors, 
          'answer5b-email-empty': false,
          'answer5b-email-invalid': false 
        });
      } else {
        setErrors({ ...errors, [errorKey]: false });
      }
      
      if (questionNumber === 1) {
        setCurrentQuestion(3);
        localStorage.setItem('stepZeroCurrentQuestion', '3');
        navigate('/survey/question/3');
      } else if (questionNumber === 2) {
        setCurrentQuestion(3);
        localStorage.setItem('stepZeroCurrentQuestion', '3');
        navigate('/survey/question/3');
      } else if (questionNumber === 3) {
        if (challengeCompleted === 'Yes') {
          setCurrentQuestion('4a');
          localStorage.setItem('stepZeroCurrentQuestion', '4a');
          navigate('/survey/question/4a');
        } else {
          setCurrentQuestion('4b');
          localStorage.setItem('stepZeroCurrentQuestion', '4b');
          navigate('/survey/question/4b');
        }
      } else if (questionId === '4a') {
        setCurrentQuestion('5a');
        localStorage.setItem('stepZeroCurrentQuestion', '5a');
        navigate('/survey/question/5a');
      } else if (questionId === '4b') {
        setCurrentQuestion('5b');
        localStorage.setItem('stepZeroCurrentQuestion', '5b');
        navigate('/survey/question/5b');
      } else if (questionId === '4b-other') {
        setCurrentQuestion('5b');
        localStorage.setItem('stepZeroCurrentQuestion', '5b');
        navigate('/survey/question/5b');
      } else if (questionId === '5a') {
        setCurrentQuestion('5c');
        localStorage.setItem('stepZeroCurrentQuestion', '5c');
        navigate('/survey/question/5c');
      } else if (questionId === '5c') {
        setCurrentQuestion(6);
        localStorage.setItem('stepZeroCurrentQuestion', '6');
        navigate('/survey/question/6');
      } else if (questionId === '5b') {
        setCurrentQuestion(6);
        localStorage.setItem('stepZeroCurrentQuestion', '6');
        navigate('/survey/question/6');
      } else if (questionNumber === 6) {
        setCurrentQuestion(7);
        localStorage.setItem('stepZeroCurrentQuestion', '7');
        navigate('/survey/question/7');
      } else if (questionNumber === 7) {
        setCurrentQuestion(8);
        localStorage.setItem('stepZeroCurrentQuestion', '8');
        navigate('/survey/question/8');
      } else if (questionNumber === 8) {
        console.log('Calling completeSurvey for question 8');
        setFinalQuestionSubmitted(true);
        completeSurvey();
        return; // Add return to prevent further execution
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

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setErrors({ ...errors, location: false });
  };

  const assignChallenge = () => {
    if (!selectedLocation) {
      setErrors({ ...errors, location: true });
      setShakeTrigger(prev => prev + 1);
      return;
    }

    const challenge = getRandomChallenge(selectedLocation);
    setAssignedChallenge(challenge);
    
    // Save progress to localStorage
    localStorage.setItem('stepZeroLocation', selectedLocation);
    localStorage.setItem('stepZeroChallenge', challenge);
    localStorage.setItem('stepZeroCurrentQuestion', '0');
    
    // Fade out location selection
    setShowLocationSelection(false);
    
    // Fade in challenge assignment screen after a brief delay
    setTimeout(() => {
      setShowChallengeAssignment(true);
      setChallengeFadeIn(true);
      
      // Auto-fade out after 2.25 seconds (like the old intro)
      const timer = setTimeout(() => {
        setChallengeFadeIn(false);
        setTimeout(() => {
          setShowChallengeAssignment(false);
          setShowChallengeText(true);
        }, 300);
      }, 2250);
      
      setChallengeAssignmentTimer(timer);
    }, 300);
  };



  const continueToSurvey = () => {
    setShowChallengeText(false);
    setCurrentQuestion(1);
    localStorage.setItem('stepZeroCurrentQuestion', '1');
    navigate('/survey/question/1');
  };

  const saveProgress = () => {
    try {
      localStorage.setItem('stepZeroAnswers', JSON.stringify(answers));
      localStorage.setItem('stepZeroCurrentQuestion', currentQuestion.toString());
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const selectOption = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setErrors({ ...errors, [questionId]: false });

    // Save progress after each answer
    setTimeout(() => {
      localStorage.setItem('stepZeroAnswers', JSON.stringify(newAnswers));
    }, 100);

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

  const completeSurvey = async () => {
    console.log('completeSurvey function called');
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Already submitting, returning early');
      return;
    }
    
    console.log('Setting isSubmitting to true and showing submitted page');
    setIsSubmitting(true);
    
    // Show submitted page first
    console.log('Setting showSubmitted to true and surveyHidden to true');
    setShowSubmitted(true);
    setSurveyHidden(true);
    
    // After 2.25 seconds (same as intro), proceed with submission
    submittedTimerRef.current = setTimeout(async () => {
      setShowSubmitted(false);
      
      // Wait for fade out animation to complete, then show thank you page
      setTimeout(async () => {
        try {
          // Upload file to Supabase Storage if consent was given and file exists
          let fileUrl = null;
          console.log('File upload check:', { selectedFile: !!selectedFile, question6: answers.question6, supabase: !!supabase });
          if (selectedFile && answers.question6 === 'Yes' && supabase) {
            try {
              console.log('Uploading file to Supabase Storage...');
              console.log('File details:', { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type });
              
              // Sanitize filename to remove spaces and special characters
              const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
              const fileName = `${Date.now()}_${sanitizedName}`;
              console.log('Original filename:', selectedFile.name);
              console.log('Sanitized filename:', sanitizedName);
              console.log('Generated filename:', fileName);
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('survey_media')
                .upload(fileName, selectedFile);

              if (uploadError) {
                console.error('Error uploading file:', uploadError);
                console.error('Upload error details:', uploadError.message);
                // Continue without file upload - don't fail the entire survey
              } else {
                console.log('File uploaded successfully:', uploadData);
                // For private bucket, we store the file path instead of public URL
                // The file can be accessed later using signed URLs
                fileUrl = `${fileName}`;
                console.log('File path stored:', fileUrl);
              }
            } catch (fileError) {
              console.error('Error in file upload:', fileError);
              console.error('File error details:', fileError.message);
              // Continue without file upload - don't fail the entire survey
            }
          } else {
            console.log('Skipping file upload:', { 
              hasFile: !!selectedFile, 
              consent: answers.question6 === 'Yes', 
              hasSupabase: !!supabase 
            });
          }

          // Prepare survey data for Supabase
          const surveyData = {
            challenge_completed: challengeCompleted,
            selected_location: selectedLocation,
            assigned_challenge: assignedChallenge,
            question3_answer: answers.question3 || '',
            question4a_answer: answers.question4a || '',
            question4b_answer: answers.question4b || '',
            question4b_other: answers['answer4b-other'] || '',
            question5a_answer: answers.question5a || '',
            question5a_other: answers['answer5a-other'] || '',
            question5b_answer: answers.question5b || '',
            question5b_email: answers['answer5b-email'] || '',
            question5c_answer: answers.question5c || '',
            question6_answer: answers.question6 || '',
            question7_age: answers.age || '',
            question8_gender: answers.gender || '',
            terms_consent: termsConsent,
            completion_time: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client-side', // Will be captured server-side if needed
            survey_version: '2.0',
            media_file_url: fileUrl, // Add the file URL to the survey data
            media_file_name: selectedFile ? selectedFile.name : null
          };

          // Send data to Supabase
          console.log('Attempting to save survey data to Supabase...');
          console.log('Survey data:', surveyData);
          
          let supabaseSuccess = false;
          
          if (supabase) {
            console.log('Supabase client is available');
            const { data, error } = await supabase
              .from('survey_responses')
              .insert([surveyData]);

            if (error) {
              console.error('Error saving survey response:', error);
              console.error('Error details:', error.message);
              // Continue with survey completion even if save fails
            } else {
              console.log('Survey response saved successfully:', data);
              console.log('Saved data:', data);
              supabaseSuccess = true;
            }
          } else {
            console.error('Supabase client is not available - check your environment variables');
            console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
            console.log('Supabase Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
          }

          // Send email backup if Supabase fails
          if (!supabaseSuccess) {
            console.log('Supabase failed, sending email backup...');
            const emailSuccess = await sendEmailBackup(surveyData);
            if (emailSuccess) {
              console.log('Email backup sent successfully');
            } else {
              console.log('Email backup also failed');
            }
          }

          setShowThankYou(true);
          const type = challengeCompleted === 'Yes' ? 'completed' : 'not-completed';
          setThankYouType(type);
          setLastThankYouType(type);
          setSurveyCompleted(true);
          setIsSubmitting(false); // Reset submitting state
          setFinalQuestionSubmitted(false); // Reset final question state
          localStorage.setItem('surveyCompleted', 'true');
          localStorage.setItem('lastThankYouType', type);
          localStorage.setItem('surveyCompletionTime', Date.now().toString());
          navigate(`/thank-you/${type}`);
        } catch (error) {
          console.error('Error in completeSurvey:', error);
          // Continue with survey completion even if save fails
          setShowThankYou(true);
          const type = challengeCompleted === 'Yes' ? 'completed' : 'not-completed';
          setThankYouType(type);
          setLastThankYouType(type);
          setSurveyCompleted(true);
          setIsSubmitting(false); // Reset submitting state
          setFinalQuestionSubmitted(false); // Reset final question state
          localStorage.setItem('surveyCompleted', 'true');
          localStorage.setItem('lastThankYouType', type);
          localStorage.setItem('surveyCompletionTime', Date.now().toString());
          navigate(`/thank-you/${type}`);
        }
      }, 18); // Wait for fade out animation
    }, 2250);
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

  // Function to get signed URL for accessing private files
  const getSignedUrl = async (filePath) => {
    if (!supabase || !filePath) return null;
    
    try {
      const { data, error } = await supabase.storage
        .from('survey_media')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      return null;
    }
  };

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Function to send email backup
  const sendEmailBackup = async (surveyData) => {
    try {
      console.log('Sending email backup...');
      
      // Convert file to base64 if it exists (limit to 5MB for email)
      let fileBase64 = null;
      if (selectedFile) {
        console.log('Processing file for email backup:', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        
        const maxEmailSize = 5 * 1024 * 1024; // 5MB limit for email
        if (selectedFile.size <= maxEmailSize) {
          try {
            fileBase64 = await fileToBase64(selectedFile);
            console.log('File converted to base64 successfully, length:', fileBase64.length);
          } catch (error) {
            console.error('Error converting file to base64:', error);
          }
        } else {
          console.log('File too large for email backup, skipping file data');
        }
      } else {
        console.log('No file selected for email backup');
      }
      
      // Add file information to the email data
      const emailData = {
        ...surveyData,
        file_info: selectedFile ? `File attached: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'No file attached',
        file_uploaded: selectedFile ? 'Yes' : 'No',
        file_base64: fileBase64 || 'No file data',
        file_type: selectedFile ? selectedFile.type : 'No file',
        file_name: selectedFile ? selectedFile.name : 'No file',
        file_size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'No file',
        file_download_note: selectedFile ? 'File data included in email. You can save it by copying the base64 data and converting it back to a file.' : ''
      };

      console.log('Email data prepared:', {
        hasFile: !!selectedFile,
        fileBase64Length: fileBase64 ? fileBase64.length : 0,
        fileType: selectedFile ? selectedFile.type : 'No file'
      });
      
      // Try sending email with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          console.log(`Attempting to send email (attempt ${4 - retries}/3)...`);
          const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            emailData,
            EMAILJS_PUBLIC_KEY
          );
          console.log('Email backup sent successfully:', result);
          return true;
        } catch (error) {
          console.error(`Email attempt ${4 - retries}/3 failed:`, error);
          retries--;
          if (retries > 0) {
            console.log(`Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
      
      console.error('All email attempts failed');
      return false;
    } catch (error) {
      console.error('Error in sendEmailBackup:', error);
      return false;
    }
  };

  const handleInputChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: false });
    }
    // Clear email-specific errors when user types
    if (questionId === 'answer5b-email') {
      setErrors({ 
        ...errors, 
        'answer5b-email-empty': false,
        'answer5b-email-invalid': false 
      });
    }
  };

  if (showThankYou) {
    return (
      <div className="container">
        <div className="nav-bar">
          <div className="nav-links">
            <button ref={homeBtnRef} className="nav-btn" onClick={goBackToMain}>Home</button>
            <button
              ref={aboutBtnRef}
              className="nav-btn"
              onClick={() => {
                setPreviousPage(thankYouType);
                setShowThankYou(false);
                setShowAbout(true);
                navigate('/about');
              }}
            >
              About
            </button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
            <div className="nav-indicator" style={indicatorStyle}></div>
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
              <button className="not-interested-btn" onClick={handleNotInterestedBack} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                Go Back
              </button>
              <button className="not-interested-btn" onClick={() => { setPreviousPage('not-interested'); setShowThankYou(false); setShowAbout(true); navigate('/about'); }} style={{ marginTop: '5px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
          {thankYouType === 'completed' && (
            <>
              <h2>Thank You</h2>
              <p>Congratulations on Taking Step One</p>
              <p className="subheading">Keep up with our social media for more updates and to find out more about your next steps</p>
              <button className="about-btn" onClick={() => { setPreviousPage('completed'); setShowThankYou(false); setShowAbout(true); navigate('/about'); }} style={{ marginTop: '15px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </>
          )}
          {thankYouType === 'not-completed' && (
            <>
              <h2>Thank You</h2>
              <p>Thanks for checking us out. Maybe next time.</p>
              <p className="subheading">Keep up with our socials in case you change your mind and to find out more about your next steps</p>
              <button className="about-btn" onClick={() => { setPreviousPage('not-completed'); setShowThankYou(false); setShowAbout(true); navigate('/about'); }} style={{ marginTop: '15px', marginBottom: '7.5px' }}>
                About Step Zero
              </button>
              <div className="social-links">
                <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
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
            <button ref={homeBtnRef} className="nav-btn" onClick={goBackToMain}>Home</button>
            <button
              ref={aboutBtnRef}
              className="nav-btn"
              onClick={() => { setPreviousPage('privacy'); setShowPrivacy(false); setShowAbout(true); navigate('/about'); }}
            >About</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
            <div className="nav-indicator" style={indicatorStyle}></div>
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
            <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
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
            <button ref={homeBtnRef} className="nav-btn" onClick={goBackToMain}>Home</button>
            <button ref={aboutBtnRef} className="nav-btn">About</button>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
            <div className="nav-indicator" style={indicatorStyle}></div>
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
              <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon">
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
              <button ref={homeBtnRef} className="nav-btn" onClick={goBackToMain}>Home</button>
              <button
                ref={aboutBtnRef}
                className="nav-btn"
                onClick={() => { setPreviousPage('hero'); setShowAbout(true); }}
              >
                About
              </button>
              <button className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>Foundations</button>
              <div className="nav-indicator" style={indicatorStyle}></div>
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
              <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon">
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

      {showSubmitted && (
        <div className="submitted-overlay">
          <div className="submitted-content">
            <h3>SUBMITTED</h3>
          </div>
        </div>
      )}

      {showSurvey && !showSubmitted && !showThankYou && !surveyHidden && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${updateProgress()}%` }}></div>
          </div>

          {(currentQuestion > 0 || typeof currentQuestion === 'string') && (
            <button className="survey-exit-btn" onClick={goBackToMain}>
              ×
            </button>
          )}

          <div className="survey">
            {showLocationSelection && (
              <div className="question location-selection fade-in">
                <h3>Where did you find your card?</h3>
                <div className="text-input-container">
                  <select
                    className={`text-input ${errors.location ? 'shake' : ''}`}
                    value={selectedLocation}
                    onChange={(e) => selectLocation(e.target.value)}
                    key={`location-${shakeTrigger}`}
                  >
                    <option value="">Select location</option>
                    <option value="Beach/Park">Beach/Park</option>
                    <option value="Coffee Shop/Library">Coffee Shop/Library</option>
                    <option value="Fitness Class (Yoga, HIIT, Spin, Pilates)">Fitness Class (Yoga, HIIT, Spin, Pilates)</option>
                    <option value="Martial Arts Gym">Martial Arts Gym</option>
                    <option value="Movies/Mall/Bowling/Arcade/Theme Park">Movies/Mall/Bowling/Arcade/Theme Park</option>
                    <option value="Office">Office</option>
                    <option value="Weightlifting Gym">Weightlifting Gym</option>
                  </select>
                  {errors.location && <div className="error-message">Please select a location</div>}
                </div>
                <div className="button-container">
                  <button className="back-btn small" onClick={goBackToMain}>
                    Back
                  </button>
                  <button 
                    className="continue-btn small" 
                    onClick={assignChallenge}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {showChallengeAssignment && (
              <div className="question challenge-assignment">
                <h3>Here is your challenge, come back when you've completed it</h3>
              </div>
            )}

            {showChallengeText && (
              <div className="question challenge-text-screen fade-in">
                <div className="challenge-text">
                  {assignedChallenge}
                </div>
                <div className="button-container">
                  <button className="back-btn small" onClick={showNotInterested}>
                    Not Interested
                  </button>
                  <button className="continue-btn small" onClick={continueToSurvey}>
                    I've Completed it
                  </button>
                </div>
              </div>
            )}





          {currentQuestion === 1 && (
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(1)}
                >
                  Next
                </button>
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(3)}
                >
                  Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(4, 'a')}
                >
                  Next
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
                    className={`option ${answers.question4b === 'I didn\'t have time' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'I didn\'t have time')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I didn't have time</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'I was too nervous' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'I was too nervous')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I was too nervous</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'I thought it was pointless' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'I thought it was pointless')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I thought it was pointless</div>
                  </div>
                  <div 
                    className={`option ${answers.question4b === 'I\'m not interested' ? 'selected' : ''}`}
                    onClick={() => selectOption('question4b', 'I\'m not interested')}
                  >
                    <div className="radio-circle"></div>
                    <div className="option-text">I'm not interested</div>
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(4, 'b')}
                >
                  Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(5, 'a')}
                >
                  Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(5, 'c')}
                >
                  Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(5, 'b')}
                >
                  Next
                </button>
              </div>
              
              {showEmailSection && (
                <div className="email-section">
                  <div className="text-input-container">
                    <input
                      type="email"
                      className={`text-input ${errors['answer5b-email-empty'] || errors['answer5b-email-invalid'] ? 'shake' : ''}`}
                      placeholder="name@domain.com"
                      value={answers['answer5b-email'] || ''}
                      onChange={(e) => handleInputChange('answer5b-email', e.target.value)}
                      key={`answer5b-email-${shakeTrigger}`}
                    />
                    {errors['answer5b-email-empty'] && <div className="error-message">Please provide an email address</div>}
                    {errors['answer5b-email-invalid'] && <div className="error-message">Please provide a valid email address</div>}
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
                  <button 
                    className="continue-btn small" 
                    onClick={() => validateAndContinue(7)}
                  >
                    Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(8)}
                >
                  Next
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
                <button 
                  className="continue-btn small" 
                  onClick={() => validateAndContinue(6)}
                >
                  Next
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
              <a href="https://www.instagram.com/stepzeroglobal/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/stepzeroglobal" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/19jDfxHjXX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon">
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
        <Route path="/survey/location" element={<AppContent />} />
        <Route path="/survey/question/:questionNum" element={<AppContent />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
