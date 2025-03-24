    import { auth, provider, signInWithPopup } from '../config/firebaseConfig';

    export const LoginButton = () =>{
      const signInWithGoogle = async () => {
        try {
          await signInWithPopup(auth, provider);
          // Handle successful sign-in (e.g., redirect, store user info)
        } catch (error) {
          // Handle error (e.g., display error message)
          console.error("Error signing in with Google", error);
        }
      };

      return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      );
    }
