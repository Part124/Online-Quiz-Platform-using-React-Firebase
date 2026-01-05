import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function AdminCreateUser() {
  const createUser = async () => {
    await createUserWithEmailAndPassword(
      auth,
      "user@email.com",
      "temporaryPassword123"
    );
    alert("User created successfully");
  };

  return <button onClick={createUser}>Create User</button>;
}

export default AdminCreateUser;
