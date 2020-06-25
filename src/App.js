import React, { Component } from 'react';
import './App.css';

//https://szentiras.hu/api/ref/2Kor1:3/*
const PATH_BASE = 'https://szentiras.hu/api/ref/';
const DEFAULT_SEARCHED_REF = 'Jn 3,14-17';
const ALL_TRANSLATIONS = '/*';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchedRef: DEFAULT_SEARCHED_REF,
    };

    this.setSearchedReference = this.setSearchedReference.bind(this);
    this.fetchSearchedReference = this.fetchSearchedReference.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);

  }

  setSearchedReference(result) {
    this.setState({ result });
  }

  fetchSearchedReference(searchedRef) {
    fetch(`${PATH_BASE}${searchedRef}${ALL_TRANSLATIONS}`)
    .then(response => response.json())
    .then(result => this.setSearchedReference(result))
    .catch(error => error);
  }

  componentDidMount() {
    const { searchedRef } = this.state;
    this.fetchSearchedReference(searchedRef);
  }

  onSearchChange(event) {
    this.setState({ searchedRef: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchedRef } = this.state;
    this.fetchSearchedReference(searchedRef);
    event.preventDefault();
  }

  onDelete(id) {
    const notTODelete = item => item.canonicalUrl !== id;
    const updatedList = this.state.result.filter(notTODelete);
    this.setState({ result: updatedList });
  }

  render() {
    const { searchedRef, result } = this.state;
    if (!result) { return null; }
    return (
      <div className="page">
        <Header />
        <div className="clearfix">
          <div className="searchWrapper">
            <Search
              value={searchedRef}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
            >
              Search
            </Search>
          </div>
          <div className="refWrapper">
            <CanonicalRef
              reference={searchedRef}
            />
          </div>
        </div>
        { result &&
          <Table
            result={result}
            onDelete={this.onDelete}
          />
        }
        <Footer />
      </div>
    );
  }
}

const Header = () =>
  <div className="header">
    <div className="headerContainer">
      <h1>Parallel Verses</h1>
      <h4>in Hungarian Bible Translations</h4>
    </div>
  </div>

const Search = ({ value, onChange, onSubmit, children }) =>
  <div className="search">
    <div className="searchContainer">
      <h3>Verse(s)</h3> 
      <h3>reference:</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    </div>
  </div>

const CanonicalRef = ({reference}) =>
  <div className="reference">
    <div className="referenceConatiner">
      <span>
        {reference}
      </span>
    </div>
  </div>

const Table = ({ result, onDelete }) =>
  <div className = "table">
    {result.map(item =>
      <div key={item.canonicalUrl}>
        <div className="translationName">
          {item.translationName}
        </div>
        <div className="table-row">
            <span className="text">{item.text}</span>
            <span className="buttonDel">
              <Button
                onClick={() => onDelete(item.canonicalUrl)}
              >
                &#9746;
              </Button>
            </span>
        </div>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Footer = () =>
  <div className="footer">
    <p className="api">This website uses <a href="http://szentiras.hu/api" target="_blank">Szentiras API</a>.</p>
    <p className="madeBy">&#9400; 2020 <a href="http://parragi.com" target="_blank">parragi.com</a></p>
  </div>

export default App;