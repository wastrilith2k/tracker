import { useNavigate } from "react-router-dom";
import { StyledRightTopButton } from "./styles";
import { Icon } from "./Icon";

export const MetricsNavButton = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("./metrics");
  }

  return (
    <StyledRightTopButton onClick={handleClick}><Icon name="show_chart" size={48} /></StyledRightTopButton>
  );
}