import styled from "styled-components";

type LoaderProps = {
  isLoading: boolean;
  children: React.ReactNode;
};

const Spinner = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #333;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = ({ isLoading, children }: LoaderProps) => {
  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Spinner /> Chargement…
      </div>
    );
  }

  return children as JSX.Element;
};

export default Loader;
