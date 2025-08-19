import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showChallengeIntro, setShowChallengeIntro] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState('');
  const [showOtherSection, setShowOtherSection] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errors, setErrors] = useState({});

  const totalQuestions = 6;

  useEffect(() => {
    if (showChallengeIntro) {
      const timer = setTimeout(() => {
        setShowChallengeIntro(false);
        setCurrentQuestion(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showChallengeIntro]);

  const startSurvey = () => {
    setShowSurvey(true);
    setShowChallengeIntro(true);
  };

  const showNotInterested = () => {
    setShowSurvey(true);
    setShowThankYou(true);
    setThankYouType('not-interested');
  };

  const updateProgress = () => {
    let progress = 0;
    if (currentQuestion === 1) progress = 20;
    else if (currentQuestion === 2) progress = 40;
    else if (currentQuestion === 3) progress = 60;
    else if (currentQuestion === '4a' || currentQuestion === '4b') progress = 70;
    else if (currentQuestion === '4b-other') progress = 75;
    else if (currentQuestion === '5a' || currentQuestion === '5b') progress = 80;
    else if (currentQuestion === '5b-email') progress = 85;
    else if (currentQuestion === 6) progress = 90;
    return progress;
  };

  const validateAndContinue = (questionNumber, suffix = '') => {
    const questionId = suffix ? `${questionNumber}${suffix}` : questionNumber;
    let isValid = false;

    if (questionNumber === 1 || questionNumber === 2 || questionId === '4a' || questionId === '4b-other' || questionId === '5b-email') {
      const answer = answers[`answer${questionId}`] || '';
      isValid = answer.trim().length > 0;
    } else if (questionNumber === 3) {
      isValid = answers[`question${questionNumber}`] !== undefined;
    }

    if (isValid) {
      setErrors({ ...errors, [questionId]: false });
      
      if (questionNumber === 1) {
        setCurrentQuestion(2);
      } else if (questionNumber === 2) {
        setCurrentQuestion(3);
      } else if (questionId === '4a') {
        setCurrentQuestion('5a');
      } else if (questionId === '4b-other') {
        setCurrentQuestion('5b');
      } else if (questionId === '5b-email') {
        setCurrentQuestion(6);
      }
    } else {
      setErrors({ ...errors, [questionId]: true });
    }
  };

  const selectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    setErrors({ ...errors, [questionId]: false });

    if (questionId === 'question3') {
      setChallengeCompleted(option);
      if (option === 'Yes') {
        setTimeout(() => setCurrentQuestion('4a'), 800);
      } else {
        setTimeout(() => setCurrentQuestion('4b'), 800);
      }
    } else if (questionId === 'question4b') {
      if (option === 'Other') {
        setShowOtherSection(true);
      } else {
        setTimeout(() => setCurrentQuestion('5b'), 800);
      }
    } else if (questionId === 'question5b') {
      if (option === 'Yes') {
        setShowEmailSection(true);
      } else {
        setTimeout(() => setCurrentQuestion(6), 800);
      }
    } else if (questionId === 'question6') {
      if (option === 'Yes') {
        setShowMediaSection(true);
      } else {
        completeSurvey();
      }
    } else if (questionId === 'question5a') {
      setTimeout(() => setCurrentQuestion(6), 800);
    }
  };

  const declineResponse = () => {
    setCurrentQuestion('5a');
  };

  const completeSurvey = () => {
    setShowThankYou(true);
    setThankYouType(challengeCompleted === 'Yes' ? 'completed' : 'not-completed');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 1200);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
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
        <div className="thank-you-page">
          {thankYouType === 'not-interested' && (
            <>
              <h2>Got it.</h2>
              <p>Be sure to keep up with our socials if you change your mind.</p>
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
              <h2>Thank You for Participating</h2>
              <p>Congratulations on Taking Step Zero</p>
              <p className="subheading">Keep up with our social media for more updates:</p>
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
              <h2>Thank You</h2>
              <p>Thanks for checking us out. Maybe next time.</p>
              <p className="subheading">Keep up with our socials if you change your mind:</p>
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
          <div className="copyright-footer">
            <span>© Step Zero, Inc 2025</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {!showSurvey && (
        <div className="hero">
          <h1 className="main-header">This is Step Zero</h1>
          <p className="sub-header">Become the Best Version of Yourself Whether you Like it or Not</p>
          <button className="continue-btn" onClick={startSurvey}>Continue</button>
          <button className="not-interested-btn" onClick={showNotInterested}>Not Interested</button>
        </div>
      )}

      {showSurvey && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${updateProgress()}%` }}></div>
          </div>

          {showChallengeIntro && (
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
                  placeholder="Enter the challenge written on the card..."
                  value={answers.answer1 || ''}
                  onChange={(e) => handleInputChange('answer1', e.target.value)}
                  rows="4"
                />
                <div className="button-container">
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
                  placeholder="Enter where you found your card..."
                  value={answers.answer2 || ''}
                  onChange={(e) => handleInputChange('answer2', e.target.value)}
                  rows="4"
                />
                <div className="button-container">
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
              <div className="options">
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
              {errors.question3 && <div className="error-message">Please select an option before continuing.</div>}
            </div>
          )}

          {currentQuestion === '4a' && (
            <div className="question">
              <h3>What made you decide to do it?</h3>
              <div className="text-input-container">
                <textarea
                  className="text-input"
                  placeholder="Enter your response..."
                  value={answers.answer4a || ''}
                  onChange={(e) => handleInputChange('answer4a', e.target.value)}
                  rows="4"
                />
                <div className="button-container">
                  <button className="continue-btn small" onClick={() => validateAndContinue(4, 'a')}>
                    Continue
                  </button>
                </div>
                <div className="decline-container">
                  <button className="decline-btn" onClick={declineResponse}>Decline to respond</button>
                </div>
              </div>
            </div>
          )}

          {currentQuestion === '4b' && (
            <div className="question">
              <h3>Why not?</h3>
              <div className="options">
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
              {errors.question4b && <div className="error-message">Please select an option before continuing.</div>}
              
              {showOtherSection && (
                <div className="other-section">
                  <div className="text-input-container">
                    <textarea
                      className={`text-input ${errors['answer4b-other'] ? 'shake' : ''}`}
                      placeholder="Other..."
                      value={answers['answer4b-other'] || ''}
                      onChange={(e) => handleInputChange('answer4b-other', e.target.value)}
                      rows="4"
                    />
                    <div className="button-container">
                      <button className="continue-btn small" onClick={() => validateAndContinue(4, 'b-other')}>
                        Continue
                      </button>
                    </div>
                    {errors['answer4b-other'] && <div className="error-message">Please provide a response</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion === '5a' && (
            <div className="question">
              <h3>How would you describe your level of discomfort completing your challenge?</h3>
              <div className="options">
                <div 
                  className={`option ${answers.question5a === 'Too Comfortable' ? 'selected' : ''}`}
                  onClick={() => selectOption('question5a', 'Too Comfortable')}
                >
                  <div className="radio-circle"></div>
                  <div className="option-text">Too Comfortable</div>
                </div>
                <div 
                  className={`option ${answers.question5a === 'Comfortable' ? 'selected' : ''}`}
                  onClick={() => selectOption('question5a', 'Comfortable')}
                >
                  <div className="radio-circle"></div>
                  <div className="option-text">Comfortable</div>
                </div>
                <div 
                  className={`option ${answers.question5a === 'Neutral' ? 'selected' : ''}`}
                  onClick={() => selectOption('question5a', 'Neutral')}
                >
                  <div className="radio-circle"></div>
                  <div className="option-text">Neutral</div>
                </div>
                <div 
                  className={`option ${answers.question5a === 'Uncomfortable' ? 'selected' : ''}`}
                  onClick={() => selectOption('question5a', 'Uncomfortable')}
                >
                  <div className="radio-circle"></div>
                  <div className="option-text">Uncomfortable</div>
                </div>
                <div 
                  className={`option ${answers.question5a === 'Really Uncomfortable' ? 'selected' : ''}`}
                  onClick={() => selectOption('question5a', 'Really Uncomfortable')}
                >
                  <div className="radio-circle"></div>
                  <div className="option-text">Really Uncomfortable</div>
                </div>
              </div>
              {errors.question5a && <div className="error-message">Please select an option before continuing.</div>}
            </div>
          )}

          {currentQuestion === '5b' && (
            <div className="question">
              <h3>Would you like to be reminded of Step Zero?</h3>
              <div className="options">
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
              {errors.question5b && <div className="error-message">Please select an option before continuing.</div>}
              
              {showEmailSection && (
                <div className="email-section">
                  <div className="text-input-container">
                    <input
                      type="email"
                      className={`text-input ${errors['answer5b-email'] ? 'shake' : ''}`}
                      placeholder="name@example.com"
                      value={answers['answer5b-email'] || ''}
                      onChange={(e) => handleInputChange('answer5b-email', e.target.value)}
                    />
                    <div className="button-container">
                      <button className="continue-btn small" onClick={() => validateAndContinue(5, 'b-email')}>
                        Continue
                      </button>
                    </div>
                    {errors['answer5b-email'] && <div className="error-message">Please provide a response</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion === 6 && (
            <div className="question">
              <h3>Do you consent to have your response anonymously shared on our Instagram page?</h3>
              <div className="options">
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
              {errors.question6 && <div className="error-message">Please select an option before continuing.</div>}
              
              {showMediaSection && (
                <div className="media-section">
                  <h4>Photo/Video Attachment (optional):</h4>
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
                    <>
                      <span className="file-name">{selectedFile.name}</span>
                      <button className="remove-file" onClick={removeFile}>Remove</button>
                      {showCheckmark && <span className="upload-checkmark">✓</span>}
                    </>
                  )}
                  <div className="button-container">
                    <button className="continue-btn small" onClick={completeSurvey}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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

          <div className="copyright-footer">
            <span>© Step Zero, Inc 2025</span>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
