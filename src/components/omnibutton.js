import React from 'react';
import SVGInline from "react-svg-inline"
import { db } from '../base';
import config from '../config';
import NameInputForm from './nameInputForm';

export default class OmniButton extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.getDataFromDatabase = this.getDataFromDatabase.bind(this);
        this.submitNameCallback = this.submitNameCallback.bind(this);
        this.onUnload = this.onUnload.bind(this);

        this.dbRef = null;
        this.state = {
            globalClickCount: null,
            name: null,
            isActive: false,
            showInput: false,
            buttonKey: null,
            currentUser: null
        };

        this.getDataFromDatabase();
    }

    handleClick(event) {
        event.preventDefault();
        const buttonComponents = [ 
            document.getElementById('buttonBottom'), 
            document.getElementById('buttonTop'),
            document.getElementById('buttonHighlight')
        ];

        buttonComponents.map((component) => {
            // console.log(component);
            component.classList.remove("buttonDown");
            window.requestAnimationFrame(function(time) {
                window.requestAnimationFrame(function(time) {
                    component.classList.add("buttonDown");
                });
            });    
        });

        this.dbRef.once('value').then((data) => {
            
            const value = data.val();
            const key = this.state.buttonKey;
            const clicks = value[key].globalClickCount + 1;

            this.dbRef.child(key).once('value', (childData) => {
                if(childData.val().isActive) {
                    this.dbRef.child(key).update({
                        globalClickCount: clicks
                    }).then(() => {
                        if(this.state.globalClickCount >= config.clickGoal) {
                            this.dbRef.child(key).update({
                                isActive: false
                            });

                            this.setState({
                                showInput: true
                            }); 
                        }
                    });
                }
            });
        });
    }

    handleCreate(event) {
        event.preventDefault();
        this.dbRef.once('value', (data) => {
            if(data.val() === null) { 
                this.dbRef.push({
                    name: config.name,
                    globalClickCount: 0,
                    isActive: true
                });
            }
            else {
                console.log('This Omnibutton already exists!')
            }
        });
    }

    submitNameCallback(userName) {
        this.dbRef.child(this.state.buttonKey).update({
            globalClickCount: 0,
            isActive: true,
            currentUser: userName
        });

        this.setState({
            showInput: false,
            currentUser: userName
        }); 
    }

    getDataFromDatabase() {
        this.dbRef = db.ref(`/buttons/${config.id}`);

        this.dbRef.on('value', (data) => {
            const value = data.val();
            const key = Object.keys(data.val())[0]
            const button = value[key];

            this.setState({
                globalClickCount: button.globalClickCount,
                name: button.name,
                isActive: button.isActive,
                buttonKey: key,
                currentUser: button.currentUser
            });
        });
    }

    componentWillUnmount() {
        this.dbRef.off();
        window.removeEventListener("beforeunload", this.onUnload);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload)
    }

    onUnload(event) {
        if(this.state.showInput) {
            this.submitNameCallback('The previous winner didn\'t set a name!');
        }
    }

    render() {
        // <button onClick={this.handleCreate}>Create new button!</button>
        // <button onClick={() => {this.submitNameCallback(this.state.currentUser)}}>Reset Count!</button>
        const content = this.state.name ? (
            <div className="omniButtonWrapper">
                <h2>Current Button Master:</h2>
                <h1>{this.state.currentUser}</h1>
                
                <button onClick={this.handleClick} disabled={!this.state.isActive} className="svgWrapper">
                    <SVGInline svg={
                        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                        <svg id="svg2" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="65mm" width="74mm" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 262.20472 230.31496">
                         <defs>
                          <mask id="buttonOverlay" maskUnits="objectBoundingBox">
                           <path id="overlay" fill="#fff" d="m422.24 660.35a125 87.5 0 0 0 125 -87.5 125 87.5 0 0 0 -0.0488 -0.95117h0.0488v-119.85h-250v119.85h0.0684a125 87.5 0 0 0 -0.0684 0.95117 125 87.5 0 0 0 125 87.5z"/>
                          </mask>
                         </defs>
                         <g id="buttonWrapper" transform="translate(-.0000044141 -822.05)">
                          <g id="button" mask="url(#buttonOverlay)" transform="translate(-291.14 381)">
                           <rect id="buttonBottom" fill="#d40000" height="119.85" width="250" y="540.5" x="297.24"/>
                           <ellipse id="buttonTop" fill="#ff2a2a" rx="125" ry="87.5" cy="539.55" cx="422.24"/>
                           <path id="buttonHighlight" d="m542.84 537.2a137.5 87.5 0 0 1 -136.6 77.854 137.5 87.5 0 0 1 -38.709 -3.5957 125 87.5 0 0 0 50.709 7.5957 125 87.5 0 0 0 124.6 -81.854z" fill="#faa"/>
                          </g>
                         </g>
                        </svg>`
                    }/>
                </button>
                <h1>Clicks: {this.state.globalClickCount} / {config.clickGoal}</h1>
                <NameInputForm display={this.state.showInput} callback={this.submitNameCallback}/>
            </div>
        )
        : (
            <div className="loading">
                <h1>Loading...</h1>
            </div>
        );

        return (
            <div className="wrapper">
                {content}
            </div>
        );
    }
}