import React, { Component } from 'react';
import schedule from 'node-schedule';
import './Main.scss';

class Main extends Component {
  state={
    btc: 1,
    prices: {},
    shouldDisplay: []
  }

  componentDidMount() {
    this.updateSchedule = schedule.scheduleJob('15 * * * * *', () => {
      this.getCurrencies();
    });
  }

  componentWillMount() {
    this.getCurrencies();
  }

  getCurrencies = () => {
    console.log("aloha");
    fetch('http://localhost:5000/currencies')
      .then(res => res.json())
        .then(json => {
          const displayOptions =
            this.state.shouldDisplay.length>0 ? this.state.shouldDisplay
            : Object.keys(json.bpi).map(item => (true));

          this.setState({
            prices: json.bpi,
            shouldDisplay: displayOptions
          });
        })
          .catch((err) => console.log(err));
  }

  handleChange = (e) => {
    let {value} = e.target;
    value = Number(value) ? value : value.slice(0, -1);
    this.setState({btc: value});
  }

  renderHTML = (rawHTML: string) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });

  roundToTwo = (num) => (+(Math.round(num + "e+2")  + "e-2"));

  hideCurrency = (i) => {
    let shouldDisplay = [...this.state.shouldDisplay]
    shouldDisplay[i] = false;
    this.setState({ ...this.state, shouldDisplay });
  }

  showAll = () => {this.setState({ shouldDisplay: Object.keys(this.state.prices).map(item => (true)) });}

  render() {
    const {btc, prices, shouldDisplay} = this.state;

    return (
      <div>
        <div className="btc-icon" />

        <div>
          BTC:
          <input type="text" value={this.state.btc} onChange={this.handleChange} />
        </div>

        {
          prices && Object.entries(prices).map((currency, i) => (
            <div key={i} style={shouldDisplay[i] ? {display: "block"} : {display: "none"}} >
              {this.roundToTwo(currency[1].rate_float * (btc || 0))} {this.renderHTML(currency[1].symbol)}
              <div className="close" onClick={() => this.hideCurrency(i)}> X</div>
            </div>
          ))
        }

        <div className="close" onClick={() => this.showAll()}>Show all</div>

      </div>
    );
  }
}

export default Main;
