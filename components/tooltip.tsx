import styled from 'styled-components'

type TooltipProps = {
  text: string | React.ReactNode;
  children: React.ReactNode;
  width?: string;
}

const StyledTooltip = styled.div`
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black; 

    > span {
        visibility: hidden;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);

        width: ${({width}) => width || 'auto'};

        position: absolute;
        z-index: 1;
    }

    > span::after {
        content: " ";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }

    &:hover > span {
        visibility: visible;
    }
`

const Tooltip = ({text, children, width}: TooltipProps) => (
  <StyledTooltip width={width}>
    {children}
    <span>{text}</span>
  </StyledTooltip>
)

export default Tooltip
