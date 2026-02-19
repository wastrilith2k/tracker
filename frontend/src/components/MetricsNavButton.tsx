import { useNavigate } from "react-router-dom";
import { StyledRightButton } from "./styles";
import { Icon } from "./Icon";

export const MetricsNavButton = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("./metrics");
  }

  return (
    <StyledRightButton onClick={handleClick}><Icon name="show_chart" size={48} /></StyledRightButton>
  );
}