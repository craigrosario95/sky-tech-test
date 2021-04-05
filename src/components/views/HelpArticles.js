import React from 'react';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

class HelpArticles extends React.Component {
  state = {
    value: "",
    query: "",
    data: [],
    currentPage: 1,
    articlesPerPage: 10,
    search: false,
    loading: false
  };

  // Detect when the URL paramater changes and browser buttons pressed
  componentDidUpdate() {
    window.onpopstate = e => {
        this.setState({currentPage: 1})
        this.setQuery();
    };
  }

  // Set value state based on URL parameter change
  setQuery = () => {
    const { query = "" } = this.props.match.params;

    this.setState({ value: query, query }, () => {
      this.fetchResults()
    })
  }

  // Handle change of text box
  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  // Handle submission of the form
  onSubmit = (e) => {
    e.preventDefault();
    history.push(`/${this.state.value}`);
    this.setState({currentPage: 1, search: true});
    this.fetchResults();
  };

  // Fetch results from API based on user input
  fetchResults = () => {
    this.setState({loading: true});
    var url = 'https://help-search-api-prod.herokuapp.com/search?query=' + this.state.value;

    fetch(url).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
    })
    .then((responseJson) => {
        this.setState({
            data: responseJson.results
        }, () => {
          this.setState({loading: false});
        });
    })
    .catch((error) => {
        console.log(error);
    });
  };

  // Handle user clicking on pagination
  handleClick = (e) => {
    this.setState({
      currentPage: Number(e.currentTarget.id)
    });
  };

  render() {

    const { value, data, currentPage, articlesPerPage, search, loading } = this.state;

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = data.slice(indexOfFirstArticle, indexOfLastArticle);

    const renderArticles = currentArticles.map((article, index) => {
        return <li key={index}>
                    <h3 className="articleTitle">{article.title}</h3>
                    <p>{article.description}</p>
                </li>;
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / articlesPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          className={this.state.currentPage === number ? "active" : ""}
          onClick={this.handleClick}
        >
          {number}
        </li>
      );
    });

    let title;
    if (data.length === 0 && search !== true) {
      title = "How can we help?"
    } else {
      title = "Search results"
    }

    let results;
    if (data.length !== 0 && search !== false) {
      results = 
      <>
        <ul>
          {renderArticles}
        </ul>
        <ul id="page-numbers">
          {renderPageNumbers}
        </ul>
      </>
    } else if (data.length === 0 && search !== false) {
      results = <span>No results found</span>
    }

    let view;
    if (loading === false) {
        view = results
    } else {
        view = <strong className='c-spinner' role='progressbar'>Loading…</strong>
    }

    return (
      <div className="container">
        <div className="header">
          <h1 className="c-heading-bravo">{title}</h1>
        </div>
        <div className="form">
          <form onSubmit={this.onSubmit}>
            <input type="text" placeholder="Start your search now" value={value} onChange={this.onChange} required/>
            <button className="c-btn c-btn--primary">Search</button>
          </form>
        </div>
        <div className="content">
          {view}
        </div>  
      </div>
    );
  }
}

export default HelpArticles;