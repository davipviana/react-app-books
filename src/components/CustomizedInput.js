import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class CustomizedInput extends Component {
    constructor(props) {
        super(props);
        this.state = {errorMessage:''}
    }

    componentDidMount = () => {
        PubSub.subscribe('validation-error', (topic, error) => {
            if(error.field === this.props.name)
                this.setState({errorMessage:error.defaultMessage})
        })

        PubSub.subscribe('clear-validation-errors', (topic) => {
            this.setState({errorMessage:''})
        })
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id} >{this.props.label}</label>
                <input {...this.props} />
                <span className="error">{this.state.errorMessage}</span>
            </div>
        );
    }
}

