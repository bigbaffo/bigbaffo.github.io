import { useState, useEffect, useMemo } from 'react';
import './App.css';

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ message: '', gif: '' });

  const correctSound = new Audio('https://www.myinstants.com/media/sounds/windows-xp-startup.mp3');
  const wrongSound = new Audio('https://www.myinstants.com/media/sounds/windows-xp-error.mp3');
  const birthdaySound = useMemo(() => {
    const sound = new Audio('https://www.myinstants.com/media/sounds/happy-birthday-song.mp3');
    sound.loop = true;
    return sound;
  }, []);

  const showTestButton = false; // Set this to false to hide the test button

  const questions = [
    {
      question: "Welcher dieser Begriffe ist KEIN gültiger Datentyp in Python?",
      answers: [
        { text: "float", correct: false },
        { text: "tuple", correct: false },
        { text: "char", correct: true }, // char exists in C/C++ but not in Python
        { text: "dict", correct: false }
      ]
    },
    {
      question: "Wie definiert man eine Funktion in Python?",
      answers: [
        { text: "function meineFunktion():", correct: false },
        { text: "def meineFunktion():", correct: true },
        { text: "func meineFunktion():", correct: false },
        { text: "define meineFunktion():", correct: false }
      ]
    },
    {
      question: "Was ist ein Raspberry Pi?",
      answers: [
        { text: "Ein Himbeerkuchen", correct: false },
        { text: "Ein Einplatinencomputer", correct: true },
        { text: "Ein Betriebssystem", correct: false },
        { text: "Ein Radius Interpreter", correct: false }
      ]
    },
    {
      question: "Welches dieser Betriebssysteme ist Open Source?",
      answers: [
        { text: "Windows", correct: false },
        { text: "macOS", correct: false },
        { text: "Linux", correct: true },
        { text: "iOS", correct: false }
      ]
    },
    {
      question: "Welches dieser Tools wird für die Netzwerküberwachung verwendet?",
      answers: [
        { text: "Photoshop", correct: false },
        { text: "Wireshark", correct: true },
        { text: "Excel", correct: false },
        { text: "PowerPoint", correct: false }
      ]
    },
    {
      question: "Was ist der Zweck eines DNS-Servers?",
      answers: [
        { text: "IP-Adressen in Domainnamen auflösen", correct: false },
        { text: "Domainnamen in IP-Adressen auflösen", correct: true },
        { text: "E-Mails senden", correct: false },
        { text: "Webseiten hosten", correct: false }
      ]
    },
    {
      question: "Wie viele Bits hat eine IPv4-Adresse?",
      answers: [
        { text: "32", correct: true },
        { text: "64", correct: false },
        { text: "128", correct: false },
        { text: "256", correct: false }
      ]
    },
    {
      question: "Wie viele Bytes sind in einem Kilobyte (KB)?",
      answers: [
        { text: "1000", correct: false },
        { text: "1024", correct: true },
        { text: "2048", correct: false },
        { text: "512", correct: false }
      ]
    },
    {
      question: "Wann ist das Jamation Reunion Konzert?",
      answers: [
        { text: "Niemals", correct: true },
        { text: "Muss los Bruder, hab was im Ofen", correct: true },
        { text: "Leider Nein, Leider Garnicht", correct: true },
        { text: "You never know :-)", correct: true }
      ]
    },
    {
      question: "Wann geht mal wieder ne Runde Rainbow?",
      answers: [
        { text: "ES REICHT MIT DEM SCHEIß QUIZ!!!", correct: true },
        { text: "ES REICHT MIT DEM SCHEIß QUIZ!!!", correct: true },
        { text: "ES REICHT MIT DEM SCHEIß QUIZ!!!", correct: true },
        { text: "ES REICHT MIT DEM SCHEIß QUIZ!!!", correct: true }
      ]
    }
  ];

  const insults = [
    "Sogar Nicolas Cage könnte das besser!",
    "Das war so falsch, dass es Cage die Tränen in die Augen treibt!",
    "Hast du das im Cage-Meme-Handbuch nachgeschlagen?",
    "Cage schüttelt gerade enttäuscht den Kopf...",
    "Das war so schlecht, dass Cage es in seinen nächsten Film aufnimmt!",
    "Selbst ein Toastbrot hätte das gewusst!",
    "Du bist so falsch, dass selbst Google dich nicht findet!",
    "Das war so daneben, dass es fast schon Kunst ist!",
    "Cage hat gerade beschlossen, dich aus seinem Fanclub zu werfen!",
    "Das war so schlecht, dass es weh tut!"
  ];

  const goodAnswers = [
    "Gerade noch richtig geraten, du Glückspilz!",
    "Puh, das war knapp, du Genie!",
    "Gute Wahl, aber sei vorsichtig, du Schlaumeier!",
    "Das war richtig, aber nur knapp, du Besserwisser!",
    "Du hast es geschafft, aber es war knapp, du Held!",
    "Wow, sogar ein blindes Huhn findet mal ein Korn!",
    "Gut gemacht, aber das war reines Glück!",
    "Richtig geraten, aber das war pures Glück!",
    "Du hast es geschafft, aber nur weil Cage dir geholfen hat!",
    "Richtig, aber das war so offensichtlich, dass selbst Cage es gewusst hätte!"
  ];

  const gifs = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXpwdjU3OWxxZ29zZDZkYnl3a2g1YTZmOXhscXpmeHlocWR6OXdjbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rsp9jLIy0VZOKlZziw/giphy.gif",
    "https://media.giphy.com/media/3YGKFfw611fZS/giphy.gif?cid=790b7611uzpv579lqgosd6dbywkh5a6f9xlqzfxyhqdz9wcl&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGYydGNwNnhkejZqNGVya3J1MDJ6NTFiYjE0OXBjdjFxYnFveXNwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RF0qU7VHLyPRu/giphy.gif",
    "https://media.giphy.com/media/CiTLZWskt7Fu/giphy.gif?cid=790b7611uzpv579lqgosd6dbywkh5a6f9xlqzfxyhqdz9wcl&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/xTiTnC5cMmUx9bfWYU/giphy.gif?cid=ecf05e47ie5p92ldqp0o9nemgfimhtje9ww5q6jn36v5hkdc&ep=v1_gifs_search&rid=giphy.gif&ct=g"
  ];

  useEffect(() => {
    if (showScore) {
      birthdaySound.play();
    }
  }, [showScore, birthdaySound]);

  const handleAnswer = (isCorrect : boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      setPopupContent({
        message: goodAnswers[Math.floor(Math.random() * goodAnswers.length)],
        gif: gifs[Math.floor(Math.random() * gifs.length)]
      });
      correctSound.play();
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setPopupContent({
        message: insults[Math.floor(Math.random() * insults.length)],
        gif: gifs[Math.floor(Math.random() * gifs.length)]
      });
      wrongSound.play();
    }
    setShowPopup(true);
    setIsProcessing(true);
    
    setTimeout(() => {
      setShowPopup(false);
      if (isCorrect) {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
          setCurrentQuestion(nextQuestion);
        } else {
          setShowScore(true);
        }
      }
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcupGEGDobkBJ7ww-7fcTgUQFHsS-QVdrzmg&s" alt="Avatar" className="avatar-icon" />
        <h1>Law's Bday Quiz</h1>
      </header>
      {showScore ? (
        <div className="score-section">
          <h2 className="funny-font" style={{maxWidth:"90%"}}>Ergebnis: DU BISCHT N DEPP! Aber ein netter :-)</h2>
          <p className="funny-font" style={{ maxWidth: "90%" }}>
            {score === questions.length ? "Wow! DU BISCHT INFORMGNATIKA VONG BERUF HÄR! 🤖" :
             score > questions.length/2 ? "Meh....war ok mein Kerl 🎉" : 
             "Ja subbaaa hasch des gmacht! Bist ein super Kerl! 😂"}
          </p>
          <p className="funny-font" style={{ maxWidth: "90%", color: "red", fontSize: "2rem" }}>
            Falsche Antworten: {wrongAnswers}
          </p>
          <p className="funny-font" style={{ maxWidth: "90%", fontSize: "2rem" }}>Happy Birthday, Mr. Lawrence Pinoyski! 🎉🎂</p>
          <img 
            src="https://media.tenor.com/RtKfb25Sw8sAAAAM/nicolas-cage-love.gif" 
            alt="Nicolas Cage Birthday" 
            className="birthday-gif"
          />
          <button className="retry-button" onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setWrongAnswers(0);
            setShowScore(false);
            birthdaySound.pause();
            birthdaySound.currentTime = 0;
          }}>Nochmal versuchen!</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Frage {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !isProcessing && handleAnswer(answer.correct)}
                disabled={isProcessing}
              >
                {answer.text}
              </button>
            ))}
          </div>
          {showPopup && (
            <div className="popup-container">
              <img 
                src={popupContent.gif} 
                alt="Popup gif" 
                className="popup-gif"
              />
              <div className="popup-message">{popupContent.message}</div>
            </div>
          )}
          {showTestButton && (
            <button 
              className="test-button" 
              onClick={() => setShowScore(true)}
            >
              Test End Screen
            </button>
          )}
        </>
      )}
    </div>
  );
}