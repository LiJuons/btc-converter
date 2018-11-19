import React, { Component } from 'react';
import schedule from 'node-schedule';
import './Main.scss';
import CurrencyList from '../../components/CurrencyList/';
import DropDown from '../../components/DropDown/';
import Loader from '../../components/Loader/';
import ErrorMsg from '../../components/ErrorMsg/';

class Main extends Component {
  state={
    btc: '',
    prices: {},
    displayList: [],
    dropdownList: [],
    showDropdown: false,
    loading: true,
    error: ''
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
    fetch('/currencies')
      .then(res => res.json())
        .then(json => {
          const displayOptions =
            this.state.displayList.length>0 ? this.state.displayList
            : Object.keys(json.bpi).map(item => (true));

          this.setState({
            prices: json.bpi,
            displayList: displayOptions,
            loading: false
          });
        }).catch((err) => 
          this.setState({
            loading: false, 
            error: 'Failed to fetch data. Please try refreshing the page.'
          }));
  }

  toggleCurrency = (i, toShow) => {
    let displayList = [...this.state.displayList];
    let dropdownList = [...this.state.dropdownList];
    let {showDropdown} = this.state;
    displayList[i] = toShow;

    if (toShow) {
      dropdownList[i]=null;
    } else {
      dropdownList[i]=Object.keys(this.state.prices)[i];
    }

    if (dropdownList.filter(item => item!=null).length===0) {
      dropdownList = [];
      showDropdown = false;
    }

    this.setState({ ...this.state, displayList, dropdownList, showDropdown });
  }

  toggleDropdown = (toShow) => {this.setState({showDropdown: toShow});}

  handleChange = (e) => {
    let {value} = e.target;
    value = (Number(value) || value==='0.' || value.slice(-1)==='0') ? value : value.slice(0, -1);
    value = value.length<16 ? value : value.slice(0, -1);
    this.setState({btc: value});
  }

  render() {
    const {btc, prices, displayList, dropdownList, showDropdown, loading, error} = this.state;

    return (
      <div className="main-container">
        <div className="btc-icon" />

        <div>
          <div>Bitcoin</div>
          <input 
            className="btc-input" 
            type="text" 
            placeholder="Enter BTC value"
            value={this.state.btc} 
            onChange={this.handleChange} 
            onFocus={() => this.setState({btc: ''})}
          />
        </div>

        { 
          loading ? <Loader />
          : error ? <ErrorMsg err={error} />
          : <CurrencyList 
              btc={btc} 
              prices={prices} 
              displayList={displayList}  
              toggleCurrency={this.toggleCurrency}
            />
        }

        <div>
          {
            dropdownList.length>0 && 
            <div 
              className="dropdown-button"
              onClick={() => this.toggleDropdown(!showDropdown)}
            >
              Other Currencies
            </div>
          }
          {
            showDropdown && 
            <DropDown dropdownList={dropdownList} toggleCurrency={this.toggleCurrency} />
          }
        </div>

      </div>
    );
  }
}

export default Main;
