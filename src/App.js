import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';

class App extends Component {

  constructor() {
    super();
    this.state = { authorList: [], name:'', email:'', password:'' };
    this.sendForm = this.sendForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url:'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: response => {
        this.setState({ authorList: response });
      }
    });
  }

  sendForm(event) {
    event.preventDefault(); 
    
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({nome:this.state.name, email:this.state.email, senha:this.state.password}),
      success: response => {
        console.log(response);
        this.setState({authorList:response});
      },
      error: response => {
        console.log(response);
      }
    });
  }

  setName(event) {
    this.setState({name:event.target.value});
  }

  setEmail(event) {
    this.setState({email:event.target.value});
  }

  setPassword(event) {
    this.setState({password:event.target.value});
  }

  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
        <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="/">Company</a>

            <ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="/" className="pure-menu-link">Home</a></li>
                <li className="pure-menu-item"><a href="/" className="pure-menu-link">Author</a></li>
                <li className="pure-menu-item"><a href="/" className="pure-menu-link">Book</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Author Register</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.sendForm}>
                <div className="pure-control-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" name="name" value={this.state.name} onChange={this.setName} />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail}/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" name="password" value={this.state.password} onChange={this.setPassword}/>
                </div>
                <div className="pure-control-group">
                  <label></label>
                  <button type="submit" className="pure-button pure-button-primary">Send</button>
                </div>
              </form>
            </div>
            <div>
            <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.authorList.map(author => {
                        return (
                          <tr key={author.id}>
                            <td>{author.nome}</td>                
                            <td>{author.email}</td>                
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
