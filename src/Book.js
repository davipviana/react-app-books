import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import CustomizedInput from './components/CustomizedInput';
import ErrorHandler from './ErrorHandler'

class BookForm extends Component {
    constructor() {
        super();
        this.state = { title:'', price:'', authorId:'' };
        this.sendForm = this.sendForm.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setAuthorId = this.setAuthorId.bind(this);
    }

    sendForm(event) {
        event.preventDefault(); 
        
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo:this.state.title, preco:this.state.price, autorId:this.state.authorId}),
            success: response => {
                PubSub.publish('refresh-book-list', response);
                this.setState({title:'', price:'', authorId:''})
            },
            error: response => {
                if(response.status === 400) {
                    new ErrorHandler().publishErrors(response.responseJSON)
                }
            },
            beforeSend: () => {
                PubSub.publish('clear-validation-errors',{});
            } 
        });
    }
    
    setTitle(event) {
        this.setState({title:event.target.value});
    }

    setPrice(event) {
        this.setState({price:event.target.value});
    }

    setAuthorId(event) {
        this.setState({authorId:event.target.value});
    }

    render = () => {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.sendForm}>
                    <CustomizedInput id="title" type="text" name="titulo" value={this.state.title} onChange={this.setTitle} label="Title" />
                    <CustomizedInput id="price" type="text" name="preco" value={this.state.price} onChange={this.setPrice} label="Price" />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Author</label>
                        <select value={this.state.authorId} name="autorId" id="authorId" onChange={this.setAuthorId}>
                            <option value="">Select author</option>
                            {
                                this.props.authorList.map(author => {
                                    return <option value={author.id}>{author.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Send</button>
                    </div>
                </form>
            </div>
        );
    }
}

class BookTable extends Component {
    render = () => {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.bookList.map(book => {
                            return (
                                <tr key={book.id}>
                                    <td>{book.titulo}</td>
                                    <td>{book.preco}</td>
                                    <td>{book.autor.nome}</td>
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

export default class BookBox extends Component {
    constructor() {
        super();
        this.state = { bookList: [], authorList: []};
    }
    
    componentDidMount() {
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: response => {
            this.setState({ bookList: response });
            }
        });

        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: response => {
            this.setState({ authorList: response });
            }
        });

        PubSub.subscribe('refresh-book-list', (topic, newList) => {
            this.setState({ bookList: newList });
        })
    }

    render = () => {
        return (
            <div>
                <div className="header">
                    <h1>Book Register</h1>
                </div>
                <div className="content" id="content">
                    <BookForm authorList={this.state.authorList} />
                    <BookTable bookList={this.state.bookList} />
                </div>
            </div>
        );
    }
}