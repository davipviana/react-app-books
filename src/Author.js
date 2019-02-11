import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import CustomizedInput from './components/CustomizedInput';

class AuthorForm extends Component {
    constructor() {
        super();
        this.state = { name:'', email:'', password:'' };
        this.sendForm = this.sendForm.bind(this);
        this.setName = this.setName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
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
                PubSub.publish('refresh-author-list', response);
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

    render = () => {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.sendForm}>
                    <CustomizedInput id="name" type="text" name="name" value={this.state.name} onChange={this.setName} label="Name" />
                    <CustomizedInput id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
                    <CustomizedInput id="password" type="password" name="password" value={this.state.password} onChange={this.setPassword} label="Password" />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Send</button>
                    </div>
                </form>
            </div>
        );
    }
}

class AuthorTable extends Component {
    render = () => {
        return (
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
                        this.props.authorList.map(author => {
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
        );
    }
}

export default class AuthorBox extends Component {
    constructor() {
        super();
        this.state = { authorList: []};
    }
    
    componentDidMount() {
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: response => {
            this.setState({ authorList: response });
            }
        });

        PubSub.subscribe('refresh-author-list', (topic, newList) => {
            this.setState({ authorList: newList });
        })
    }

    render = () => {
        return (
            <div>
                <AuthorForm />
                <AuthorTable authorList={this.state.authorList}/>
            </div>
        );
    }
}