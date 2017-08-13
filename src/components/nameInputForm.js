import React from 'react';
import Filter from 'bad-words';
import config from '../config';
import ReactCountdownClock from 'react-countdown-clock'

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
        this.setState({
            userName: event.target.value
        });
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

                    <ReactCountdownClock seconds={20}
                                         color="#f00"
                                         alpha={0.9}
                                         size={100}
                                         onComplete={() => {console.log('ended')}} />

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