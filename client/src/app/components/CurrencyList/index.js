import React from 'react';
import './CurrencyList.scss';

const renderHTML = (rawHTML) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });

const formatNumber = (num) => ((+(Math.round(num + "e+2")  + "e-2")).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

const CurrencyList = ({btc, prices, displayList, toggleCurrency}) => (
  <div className="currency-container">
  {
    (prices) && Object.entries(prices).map((currency, i) => (
      <div key={i} 
        className="currency-rates"
        style={displayList[i] ? {display: "flex"} : {display: "none"}} 
      >
        <div className="curr-title">
          <div className="curr-descr">{currency[1].description}</div>
          <div className="curr-close" onClick={() => toggleCurrency(i, false)}>X</div>
        </div>

        <div className="curr-status">
          <div className="curr-sign">{renderHTML(currency[1].symbol)}</div>
          <div className="curr-rate">{formatNumber(currency[1].rate_float * (btc || 0))}</div>
        </div>

      </div>
    ))
  }
  </div>
);

export default CurrencyList;