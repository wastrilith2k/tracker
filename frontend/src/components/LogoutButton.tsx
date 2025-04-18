import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { StyledRightTopButton } from "./styles";
import { Icon } from "./Icon";

export const LogoutButton = () => {

  const navigate = useNavigate()
  const handleLogout = () => {
    const auth = getAuth();

    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('Sign-out successful')
    }).catch((error) => {
      // An error happened.
      console.log('Error signing out')
    }).finally(() => {
      navigate('/')
    });
  }

  return (
    <StyledRightTopButton onClick={handleLogout}><Icon name="move_item" size={48} /></StyledRightTopButton>
  );
}