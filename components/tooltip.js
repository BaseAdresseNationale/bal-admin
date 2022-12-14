import PropTypes from 'prop-types'

const Tooltip = ({text, children}) => (
  <div className='tooltip'>
    {children}
    <span className='tooltip-text'>{text}</span>

    <style jsx>{`
        /* Tooltip container */
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
        }

        /* Tooltip text */
        .tooltip .tooltip-text {
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            
            bottom: 100%;
            left: 50%; 
            margin-left: -60px;
            
            position: absolute;
            z-index: 1;
        }

        .tooltip .tooltiptext::after {
            content: " ";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: black transparent transparent transparent;
        }

        .tooltip:hover .tooltip-text {
            visibility: visible;
        }
        `}</style>
  </div>
)

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Tooltip
