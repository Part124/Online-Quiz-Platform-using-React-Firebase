import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams } from "react-router-dom";

const TakeQuiz = () => {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(null);

  // 🔹 Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      const ref = doc(db, "quizzes", id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setQuiz(data);

        // minutes → seconds
        setTimeLeft(data.timeLimit * 60);
        setAnswers(new Array(data.questions.length).fill(null));
      }
    };

    fetchQuiz();
  }, [id]);

  // 🔹 TIMER LOGIC
  useEffect(() => {
    if (timeLeft <= 0 && quiz) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  // 🔹 Handle answer select
  const handleAnswerChange = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  // 🔹 Submit quiz + score calculation
  const submitQuiz = () => {
    let totalScore = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  // 🔹 UI
  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div style={{ padding: "30px", fontSize: "18px" }}>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>

      {/* ⏱ TIMER */}
      <h3>
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </h3>

      <hr />

      {/* QUESTIONS */}
      {quiz.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h4>
            {index + 1}. {q.question}
          </h4>

          {q.options.map((opt, i) => (
            <div key={i}>
              <input
                type="radio"
                name={`q-${index}`}
                checked={answers[index] === i}
                onChange={() => handleAnswerChange(index, i)}
              />
              {opt}
            </div>
          ))}
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      {score === null && (
        <button onClick={submitQuiz}>Submit Quiz</button>
      )}

      {/* 🎯 SCORE DISPLAY */}
      {score !== null && (
        <h2 style={{ color: "green" }}>
          Your Score: {score} / {quiz.questions.length}
        </h2>
      )}
    </div>
  );
};

export default TakeQuiz;
