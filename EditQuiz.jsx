import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const EditQuiz = () => {
  const { id } = useParams(); // quiz id from URL
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  // 🔹 Fetch quiz data
  const fetchQuiz = async () => {
    const ref = doc(db, "quizzes", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setQuiz(snap.data());
    } else {
      alert("Quiz not found");
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  // 🔹 Update quiz
  const updateQuiz = async () => {
    const ref = doc(db, "quizzes", id);
    await updateDoc(ref, quiz);
    alert("Quiz updated successfully");
    navigate("/dashboard");
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px", fontSize: "18px" }}>
      <h2>Edit Quiz</h2>

      <input
        type="text"
        value={quiz.title}
        onChange={(e) =>
          setQuiz({ ...quiz, title: e.target.value })
        }
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <textarea
        value={quiz.description}
        onChange={(e) =>
          setQuiz({ ...quiz, description: e.target.value })
        }
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      {quiz.questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          <input
            value={q.question}
            onChange={(e) => {
              const newQ = [...quiz.questions];
              newQ[index].question = e.target.value;
              setQuiz({ ...quiz, questions: newQ });
            }}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button onClick={updateQuiz}>Update Quiz</button>
    </div>
  );
};

export default EditQuiz;
