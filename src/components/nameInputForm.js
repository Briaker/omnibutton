import React from 'react';
import Filter from 'bad-words';
import config from '../config';

export default class NameInputForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.state = {
            userName: '',
            errorMessage: null
        }
    }

    // componentDidMount() {
    //     this.refs.nameInput.focus();
    // }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            errorMessage: null
        });

        const filter = new Filter();

        document.getElementById('nameInput').focus();

        if(this.state.userName.length <= 0 || this.state.userName.length > config.maxNameLength) {
            this.setState({
                errorMessage: `Username must contain between 1 and ${config.maxNameLength} characters!`
            });
        }
        else if(filter.isProfane(this.state.userName)) {
            this.setState({
                errorMessage: 'Username cannot contain inappropriate words!'
            });
        }
        else {
            this.props.callback(this.state.userName);
        }
    }

    handleInput(event) { 
        event.preventDefault();
        if(event.target.value.length) {
            this.setState({
                userName: event.target.value
            });
        }
    }

    render() {
        const errorMessage = this.state.errorMessage ? (
            <p className="errorMessage">{this.state.errorMessage}</p>
        ) :
            null
        ;

        const content = this.props.display ? (
            <div className="inputWrapper">
                <div className="inputWrapperInner">
                    <h2>Congratulations!</h2>
                    <p>Please enter your name!</p>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" onChange={this.handleInput} autoFocus id="nameInput"/>
                        <button>Submit</button>
                    </form>
                    {errorMessage}
                </div>
            </div>
        ) :
            null
        ;

        return (
            <div>
                {content}
            </div>
        );
    }
}