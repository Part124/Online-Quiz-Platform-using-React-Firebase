import { useState } from "react";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimit: 10,
    status: "draft",
    questions: []
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0
        }
      ]
    });
  };

  const saveQuiz = async (status) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    await addDoc(collection(db, "quizzes"), {
      ...quiz,
      status,
      createdBy: user.uid
    });

    alert(`Quiz ${status} successfully`);
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "30px", fontSize: "18px" }}>
      <h2 style={{ fontSize: "32px" }}>Create Quiz</h2>

      {/* Quiz Title */}
      <input
        type="text"
        placeholder="Quiz Title"
        value={quiz.title}
        style={{ fontSize: "18px", padding: "10px", width: "300px" }}
        onChange={(e) =>
          setQuiz({ ...quiz, title: e.target.value })
        }
      />

      <br /><br />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={quiz.description}
        style={{ fontSize: "18px", padding: "10px", width: "300px", height: "80px" }}
        onChange={(e) =>
          setQuiz({ ...quiz, description: e.target.value })
        }
      />

      <br /><br />

      {/* Time Limit */}
      <input
        type="number"
        placeholder="Time Limit (minutes)"
        value={quiz.timeLimit}
        style={{ fontSize: "18px", padding: "10px", width: "200px" }}
        onChange={(e) =>
          setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
        }
      />

      <br /><br />

      {/* Add Question */}
      <button
        style={{ fontSize: "16px", padding: "10px 18px" }}
        onClick={addQuestion}
      >
        Add Question
      </button>

      {/* Questions List */}
      {quiz.questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "1px solid gray",
            padding: "18px",
            marginTop: "15px",
            fontSize: "18px"
          }}
        >
          <input
            type="text"
            placeholder={`Question ${index + 1}`}
            value={q.question}
            style={{ fontSize: "18px", padding: "8px", width: "100%" }}
            onChange={(e) => {
              const newQuestions = [...quiz.questions];
              newQuestions[index].question = e.target.value;
              setQuiz({ ...quiz, questions: newQuestions });
            }}
          />

          <br /><br />

          {q.options.map((opt, i) => (
            <div key={i}>
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                style={{ fontSize: "16px", padding: "8px", width: "100%" }}
                onChange={(e) => {
                  const newQuestions = [...quiz.questions];
                  newQuestions[index].options[i] = e.target.value;
                  setQuiz({ ...quiz, questions: newQuestions });
                }}
              />
            </div>
          ))}

          <br />

          <select
            value={q.correctAnswer}
            style={{ fontSize: "16px", padding: "8px" }}
            onChange={(e) => {
              const newQuestions = [...quiz.questions];
              newQuestions[index].correctAnswer = Number(e.target.value);
              setQuiz({ ...quiz, questions: newQuestions });
            }}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>

          <br /><br />

          <button
            style={{ fontSize: "16px", padding: "8px 14px" }}
            onClick={() => {
              const newQuestions = quiz.questions.filter(
                (_, i) => i !== index
              );
              setQuiz({ ...quiz, questions: newQuestions });
            }}
          >
            Remove Question
          </button>
        </div>
      ))}

      <br /><br />

      {/* Save Buttons */}
      <button
        style={{ fontSize: "16px", padding: "10px 18px" }}
        onClick={() => saveQuiz("draft")}
      >
        Save as Draft
      </button>

      <button
        style={{
          fontSize: "16px",
          padding: "10px 18px",
          marginLeft: "12px"
        }}
        onClick={() => saveQuiz("published")}
      >
        Publish Quiz
      </button>
    </div>
  );
};

export default CreateQuiz;
