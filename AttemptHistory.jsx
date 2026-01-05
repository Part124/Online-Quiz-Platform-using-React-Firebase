import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const q = query(
        collection(db, "quizAttempts"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("attemptedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const list = [];

      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setAttempts(list);
    };

    fetchAttempts();
  }, []);

  return (
    <div style={{ padding: "30px", fontSize: "18px" }}>
      <h2>📊 Quiz Attempt History</h2>

      {attempts.length === 0 && <p>No attempts yet.</p>}

      {attempts.map((a) => (
        <div
          key={a.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          <h4>{a.quizTitle}</h4>
          <p>
            Score: <b>{a.score} / {a.totalQuestions}</b>
          </p>
          <p>Time Taken: {a.timeTaken} sec</p>
          <p>
            Attempted On:{" "}
            {a.attemptedAt?.toDate().toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AttemptHistory;
