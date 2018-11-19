import React from 'react';
import './DropDown.scss';

const DropDown = (props) => (
  <div className="dropdown-list" >
    {  
      props.dropdownList.map((item, i) => (
          item &&
          <div key={i} onClick={() => props.toggleCurrency(i, true)}>
            <span>+</span> {item}
          </div>
      ))
    }
  </div>
);

export default DropDown;