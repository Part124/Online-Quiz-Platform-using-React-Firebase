import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const fetchQuizzes = async () => {
    if (!user) return;

    const q = query(
      collection(db, "quizzes"),
      where("createdBy", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const quizList = [];

    querySnapshot.forEach((doc) => {
      quizList.push({ id: doc.id, ...doc.data() });
    });

    setQuizzes(quizList);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "quizzes", id));
    fetchQuizzes();
  };

  return (
    <div style={{ padding: "30px", fontSize: "18px" }}>
      <h2 style={{ fontSize: "32px" }}>Dashboard</h2>

      <p style={{ fontSize: "20px" }}>
        Welcome, <b>{user?.email}</b>
      </p>

      <button
        style={{ fontSize: "16px", padding: "10px 18px" }}
        onClick={() => navigate("/create-quiz")}
      >
        Create New Quiz
      </button>

      <button
        style={{
          fontSize: "16px",
          padding: "10px 18px",
          marginLeft: "12px"
        }}
        onClick={handleLogout}
      >
        Logout
      </button>

      <hr style={{ margin: "25px 0" }} />

      <h3 style={{ fontSize: "26px" }}>Your Quizzes</h3>

      {quizzes.length === 0 && (
        <p style={{ fontSize: "18px" }}>
          No quizzes created yet.
        </p>
      )}

      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          style={{
            border: "1px solid gray",
            padding: "18px",
            marginBottom: "14px",
            fontSize: "18px"
          }}
        >
          <h4 style={{ fontSize: "22px" }}>{quiz.title}</h4>

          <p style={{ fontSize: "18px" }}>
            {quiz.description}
          </p>

          <p style={{ fontSize: "18px" }}>
            Status: <b>{quiz.status}</b>
          </p>

          <button
            style={{ fontSize: "16px", padding: "8px 14px" }}
            onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
          >
            Edit
          </button>

          <button
            style={{
              fontSize: "16px",
              padding: "8px 14px",
              marginLeft: "10px"
            }}
            onClick={() => handleDelete(quiz.id)}
          >
            Delete
          </button>
      <button
      onClick={() => navigate("/history")}
     style={{ marginLeft: "10px" }}
>
  View Attempt History
</button>

        </div>
      ))}
    </div>
  );
};

export default Dashboard;
